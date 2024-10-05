import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, combineLatestWith, firstValueFrom, map, Observable } from "rxjs";
import { Router } from "@angular/router";
import { FirestoreService } from "./firestore.service";
import { Timestamp } from "@angular/fire/firestore";
import { CollectionService } from "./collection.service";
import { CollectionUtil } from "@util/collection.util";
import { PlayerService } from "./player.service";
import { AuthService } from "./auth.service";
import { DartGame, DartPlayer, Game, LatschiPansch, Player } from "@interfaces";
import { PanschKey } from "@types";

@Injectable({
  providedIn: 'root'
})
export class LatschiPanschService {
  public latschiPanschCollection$: WritableSignal<LatschiPansch[]> = signal([]);
  private firestoreService: FirestoreService = inject(FirestoreService);
  private authService: AuthService = inject(AuthService);
  private playerService: PlayerService = inject(PlayerService);
  private collectionService: CollectionService = inject(CollectionService);
  private router: Router = inject(Router);
  private gameInitializedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public gameInitialized$: Observable<boolean> = this.gameInitializedSubject.asObservable();
  private currentPanschSubject: BehaviorSubject<LatschiPansch | undefined> = new BehaviorSubject<LatschiPansch | undefined>(undefined);
  public currentPansch$: Observable<LatschiPansch | undefined> = this.currentPanschSubject.asObservable();
  private playerSubject: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);
  public players$: Observable<Player[]> = this.playerSubject.asObservable();

  constructor() {
    this.collectionService.panschCollectionName$.subscribe(panschCollectionName => {
      this.firestoreService.getCollection<LatschiPansch>(panschCollectionName)
        .pipe(
          combineLatestWith(this.authService.currentUser$),
          map(([latschiPanschCollection, currentUser]) => {
            for (let i = 0; i < latschiPanschCollection.length; i++) {
              const pansch = latschiPanschCollection[i];
              if (pansch.id) {
                pansch.players = this.firestoreService.getCollection<Player>(CollectionUtil.getSubCollectionName(panschCollectionName, pansch.id, "players"));
              }
            }
            return latschiPanschCollection
              .filter(pansch => !pansch.deletedAt && currentUser ? true : pansch.setupComplete)
              .sort((a, b) => a.edition - b.edition);
          }))
        .subscribe(latschiPanschCollection => this.latschiPanschCollection$?.set(latschiPanschCollection));
    });
    this.currentPansch$.subscribe((currentPansch: LatschiPansch | undefined) => {
      if (currentPansch && currentPansch.id) {
        this.firestoreService.getCollection<Player>(CollectionUtil.getSubCollectionName(currentPansch.collectionName, currentPansch.id, "players"))
          .subscribe(players => this.playerSubject.next(players));
      }
    });
  }

  public async getPansch(): Promise<LatschiPansch | undefined> {
    const pansch = this.currentPanschSubject.value;
    if (!pansch || !pansch.id) return undefined;
    return firstValueFrom(await this.firestoreService.getDocumentWithChanges<LatschiPansch>(pansch.collectionName, pansch.id));
  }


  public getSelectedPansch(): LatschiPansch | undefined {
    return this.currentPanschSubject.value;
  }

  public async initializeGame(value: boolean): Promise<void> {
    this.gameInitializedSubject.next(value);
    if (value) {
      const pansch = this.currentPanschSubject.value;
      if (pansch) {
        pansch.setupComplete = true;
        void this.updatePansch(pansch);
      }
    }
    void this.router.navigate(['/home']);
  }

  public async createPansch(edition: number): Promise<void> {
    const latschiPanschCollectionName = await firstValueFrom(this.collectionService.panschCollectionName$);
    void this.firestoreService.addItem<LatschiPansch>(latschiPanschCollectionName, {
      edition,
      isReleased: false,
      isFinished: false,
      createdAt: Timestamp.fromDate(new Date()),
      setupComplete: false,
      collectionName: latschiPanschCollectionName
    });
  }

  public async setPansch(latschiPansch: LatschiPansch): Promise<void> {
    if (latschiPansch.id) {
      const currentPansch = await firstValueFrom(await this.firestoreService.getDocumentWithChanges<LatschiPansch>(latschiPansch.collectionName, latschiPansch.id));
      this.currentPanschSubject.next(currentPansch);
      (await this.firestoreService.getDocumentWithChanges<LatschiPansch>(latschiPansch.collectionName, latschiPansch.id))
        .subscribe(pansch => this.currentPanschSubject.next(pansch));
    }
  }

  public unsetPansch(): void {
    this.currentPanschSubject.next(undefined);
  }

  public async updatePansch(latschiPansch: LatschiPansch) {
    if (latschiPansch.id) {
      await this.firestoreService.updateItem(latschiPansch.collectionName, latschiPansch, latschiPansch.id);
    }
  }

  public async updatePanschDate(date: Timestamp): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.currentPansch$);
    if (pansch) {
      pansch.createdAt = date;
      await this.updatePansch(pansch);
    }
  }

  public async releasePansch(release: boolean): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.currentPansch$);
    if (pansch) {
      pansch.isReleased = release;
      await this.updatePansch(pansch);
    }
  }

  public async updatePanschItem<KEY extends PanschKey, T extends LatschiPansch[KEY]>(panschKey: KEY): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.currentPansch$);
    if (pansch) {
      pansch[panschKey] = true as T;
      await this.updatePansch(pansch);
    }
  }


  public async initBilliardGames(): Promise<void> {
    const currentPansch: LatschiPansch | undefined = await firstValueFrom(this.currentPansch$);
    if (currentPansch && currentPansch.id) {
      const billiardGamesCollectionName: string = CollectionUtil.getSubCollectionName(currentPansch.collectionName, currentPansch.id, "billiardGames");
      const billiardGames: Game[] = await this.firestoreService.getSnapshot<Game>(billiardGamesCollectionName);
      if (!billiardGames || billiardGames.length === 0) {
        const players: Player[] = await this.playerService.getPlayerSnapshot(currentPansch);
        players.sort((a, b) => (a.bowlingRank ?? 0) - (b.bowlingRank ?? 0));
        const length = players.length - 1;
        for (let i = 0; i < 8; i++) {
          const game: Game = {
            collectionName: billiardGamesCollectionName,
            finished: false,
            gameNumber: i + 1,
            team1: {
              player1: players[i],
              collectionName: billiardGamesCollectionName
            },
            team2: {
              player1: players[length - i],
              collectionName: billiardGamesCollectionName
            }
          };
          await this.firestoreService.addItem<Game>(game.collectionName, game);
        }
      }
    }
  }

  public async initAirHockeyGames(): Promise<void> {
    const currentPansch: LatschiPansch | undefined = await firstValueFrom(this.currentPansch$);
    if (currentPansch && currentPansch.id) {
      const airHockeyGamesCollectionName: string = CollectionUtil.getSubCollectionName(currentPansch.collectionName, currentPansch.id, "airHockeyGames");
      const airHockeyGames: Game[] = await this.firestoreService.getSnapshot<Game>(airHockeyGamesCollectionName);
      if (!airHockeyGames || airHockeyGames.length === 0) {
        const players: Player[] = await this.playerService.getPlayerSnapshot(currentPansch);
        players.sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0));
        const length = players.length - 1;
        for (let i = 0; i < 8; i++) {
          const game: Game = {
            collectionName: airHockeyGamesCollectionName,
            finished: false,
            gameNumber: i + 1,
            team1: {
              player1: players[i],
              collectionName: airHockeyGamesCollectionName,
              score: 0
            },
            team2: {
              player1: players[length - i],
              collectionName: airHockeyGamesCollectionName,
              score: 0
            }
          };
          await this.firestoreService.addItem<Game>(game.collectionName, game);
        }
      }
    }
  }

  public async initKickerGames(): Promise<void> {
    const currentPansch: LatschiPansch | undefined = await firstValueFrom(this.currentPansch$);
    if (currentPansch && currentPansch.id) {
      const kickerGamesCollectionName: string = CollectionUtil.getSubCollectionName(currentPansch.collectionName, currentPansch.id, "kickerGames");
      const kickerGames: Game[] = await this.firestoreService.getSnapshot<Game>(kickerGamesCollectionName);
      if (!kickerGames || kickerGames.length === 0) {
        const players: Player[] = await this.playerService.getPlayerSnapshot(currentPansch);
        players.sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0));
        const length = players.length - 1;
        for (let i = 0; i < 4; i++) {
          const game: Game = {
            collectionName: kickerGamesCollectionName,
            finished: false,
            gameNumber: i + 1,
            team1: {
              player1: players[i],
              player2: players[length - i],
              collectionName: kickerGamesCollectionName,
              score: 0
            },
            team2: {
              player1: players[7 - i],
              player2: players[8 + i],
              collectionName: kickerGamesCollectionName,
              score: 0
            }
          };
          await this.firestoreService.addItem<Game>(game.collectionName, game);
        }
      }
    }
  }

  public async initDart(): Promise<void> {
    const currentPansch: LatschiPansch | undefined = await firstValueFrom(this.currentPansch$);
    if (currentPansch && currentPansch.id) {
      const dartPreliminaryGamesCollectionName: string = CollectionUtil.getSubCollectionName(currentPansch.collectionName, currentPansch.id, "dartPreliminaryGames");
      const dartPreliminaryGames: Game[] = await this.firestoreService.getSnapshot<Game>(dartPreliminaryGamesCollectionName);
      if (!dartPreliminaryGames || dartPreliminaryGames.length === 0) {
        const players: Player[] = await this.playerService.getPlayerSnapshot(currentPansch);
        players.sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0));
        for (let i = 0; i < 4; i++) {
          const dartPlayers: DartPlayer[] = [];
          let playerIndex = i;
          for (let x = 0; x < 4; x++) {
            dartPlayers.push({
              id: players[playerIndex].id,
              name: players[playerIndex].name
            });
            playerIndex += 4;
          }

          const game: DartGame = {
            collectionName: dartPreliminaryGamesCollectionName,
            gameNumber: i + 1,
            players: dartPlayers
          };
          await this.firestoreService.addItem<DartGame>(game.collectionName, game);
        }
      }
    }
  }

  public async calculateFinalResult(): Promise<void> {
    const currentPansch: LatschiPansch | undefined = await firstValueFrom(this.currentPansch$);
    if (currentPansch && currentPansch.id && !currentPansch.finalCalculationFinished) {
      currentPansch.finalCalculationStarted = true;
      await this.updatePansch(currentPansch);
      const players: Player[] = await this.playerService.getPlayerSnapshot(currentPansch);
      players.sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0))
      let rank = 1;
      let tempRank = 0;
      let tempScore = players[0].totalPoints;
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (player.totalPoints === tempScore) {
          tempRank++;
        } else {
          rank += tempRank;
          tempScore = player.totalPoints;
          tempRank = 1;
        }
        player.finalRank = rank;
        await this.playerService.updatePlayer(currentPansch, player);
      }
      currentPansch.finalCalculationFinished = true;
      currentPansch.isFinished = true;
      await this.updatePansch(currentPansch);
    }
  }
}
