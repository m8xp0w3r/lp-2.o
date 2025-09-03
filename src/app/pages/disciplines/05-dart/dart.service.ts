import { inject, Injectable } from '@angular/core';
import { FirestoreService, GameService, LatschiPanschService, PlayerService } from "@services";
import { Router } from "@angular/router";
import { BehaviorSubject, firstValueFrom, map, Observable, of } from "rxjs";
import { DartGame, DartPlayer, LatschiPansch, Player } from "@interfaces";
import { CollectionUtil } from "@util/collection.util";
import { DisciplineIconName } from "@enums";

@Injectable({
  providedIn: 'root',
})
export class DartService {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  private firestoreService: FirestoreService = inject(FirestoreService);
  private playerService: PlayerService = inject(PlayerService);
  private gameService: GameService = inject(GameService);
  private router: Router = inject(Router);
  private preliminaryGamesSubject: BehaviorSubject<DartGame[]> = new BehaviorSubject<DartGame[]>([]);
  public preliminaryGames$: Observable<DartGame[]> = this.preliminaryGamesSubject
  .pipe(map(dartPreliminaryGames => dartPreliminaryGames.sort((a, b) => a.gameNumber - b.gameNumber)));
  private selectedPreliminaryGameSubject: BehaviorSubject<Observable<DartGame | undefined>> = new BehaviorSubject<Observable<DartGame | undefined>>(of(undefined));
  public selectedPreliminaryGame$: Observable<Observable<DartGame | undefined>> = this.selectedPreliminaryGameSubject.asObservable();
  private dartFinalGameSubject: BehaviorSubject<DartGame[]> = new BehaviorSubject<DartGame[]>([]);
  public dartFinalGame$: Observable<DartGame | undefined> = this.dartFinalGameSubject
  .pipe(map(finalGames => finalGames.length === 1 ? finalGames[0] : undefined));
  public preliminaryRoundFinished$: Observable<boolean> = this.preliminaryGames$.pipe(
    map(preliminaryGames => preliminaryGames.filter(preliminaryGame => preliminaryGame.calculationFinished).length === 4),
  );
  public finalRoundFinished$: Observable<boolean> = this.dartFinalGame$.pipe(
    map(finalGame => finalGame?.calculationFinished ?? false),
  );

  constructor() {
    void this.getGames();
  }

  async updateSelectedDartGame(dartGameId: string): Promise<void> {
    const filteredDartGame = (await firstValueFrom(this.preliminaryGames$)).filter(dartGame => dartGame.id === dartGameId);
    const dartGame = filteredDartGame.length === 1 ? filteredDartGame[0] : undefined;
    if (dartGame && dartGame.id) {
      const selectedDartGame: Observable<DartGame | undefined> = await this.firestoreService.getDocumentWithChanges<DartGame>(dartGame.collectionName, dartGame.id);
      this.selectedPreliminaryGameSubject.next(selectedDartGame);
    }
  }

  public resetSelectedGame(): void {
    this.selectedPreliminaryGameSubject.next(of(undefined));
  }

  public async calculateFinalRound(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch && pansch.id) {
      pansch.dartPreliminaryRoundCalculationStarted = true;
      await this.latschiPanschService.updatePansch(pansch);
      const currentGames = await this.firestoreService.getSnapshot<DartGame>((await firstValueFrom(this.preliminaryGames$))[0].collectionName);
      const finalRoundPlayers: DartPlayer[] = [];
      const playersCollectionName = CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "players");
      for (let i = 0; i < currentGames.length; i++) {
        const dartGame = currentGames[i];
        const winner = dartGame.winner;
        for (let x = 0; x < dartGame.players.length; x++) {
          const dartPlayer = dartGame.players[x];
          if (dartPlayer.id) {
            const player = (await this.firestoreService.getDocument<Player>(playersCollectionName, dartPlayer.id)).data();
            if (player) {
              player.dartScorePreliminaryRound = dartPlayer.score;
              await this.playerService.updatePlayer(pansch, player);
            } else {
              console.log("Could not update player", dartPlayer.name);
            }
          } else {
            console.log("Missing id for player", dartPlayer.name);
          }
        }
        if (winner && dartGame.calculationFinished) {
          delete winner.score;
          finalRoundPlayers.push(winner);
        }
      }
      if (finalRoundPlayers.length !== 4) {
        console.error("Error when calculating final");
        return;
      }
      const finalGame: DartGame = {
        players: finalRoundPlayers,
        gameNumber: 1,
        collectionName: CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "dartFinalGame"),
      };
      await this.firestoreService.addItem<DartGame>(finalGame.collectionName, finalGame);
      pansch.dartPreliminaryRoundCalculated = true;
      await this.latschiPanschService.updatePansch(pansch);
      void this.router.navigate(["/dart/dart-final"]);
    }
  }

  public async calculateFinal(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch && pansch.id) {
      pansch.dartFinalRoundCalculationStarted = true;
      await this.latschiPanschService.updatePansch(pansch);
      const finalGame: DartGame | undefined = await firstValueFrom(this.dartFinalGame$);
      if (!finalGame) {
        console.error("No final game available");
        return;
      }
      const currentFinalGames: DartGame[] | undefined = await this.firestoreService.getSnapshot<DartGame>(finalGame.collectionName);
      if (!currentFinalGames || currentFinalGames.length !== 1) {
        console.error("No current final games available");
        return;
      }
      const currentFinalGame = currentFinalGames[0];
      const playersCollectionName = CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "players");
      const winner = currentFinalGame.winner;
      for (let x = 0; x < currentFinalGame.players.length; x++) {
        const dartPlayer = currentFinalGame.players[x];
        if (dartPlayer.id) {
          const player = (await this.firestoreService.getDocument<Player>(playersCollectionName, dartPlayer.id)).data();
          if (player) {
            player.dartScoreFinal = dartPlayer.score;
            if (winner?.id === player.id) {
              player.dartWinner = true;
            }
            await this.playerService.updatePlayer(pansch, player);
          }
        }
      }
      pansch.dartFinalRoundCalculated = true;
      await this.latschiPanschService.updatePansch(pansch);
      await this.calculateDartResult();
      void this.router.navigate(["/dart/dart-result"]);
    }
  }

  public async calculateFakeScore(dartGame: DartGame): Promise<void> {
    const fakeScores: number[] = [0];
    for (let i = 0; i < 3; i++) {
      fakeScores.push(this.getRandomDartScore());
    }
    fakeScores.sort(() => Math.random() - 0.5);
    dartGame.players.forEach((player, index) => player.score = fakeScores[index]);
    await this.gameService.updateGame(dartGame);
  }

  private async getGames(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch && pansch.id) {
      const dartPreliminaryGamesCollectionName = CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "dartPreliminaryGames");
      const dartFinalGameCollectionName = CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "dartFinalGame");
      (await this.gameService.getGames<DartGame>(dartPreliminaryGamesCollectionName)).subscribe(games => this.preliminaryGamesSubject.next(games));
      (await this.gameService.getGames<DartGame>(dartFinalGameCollectionName)).subscribe(games => this.dartFinalGameSubject.next(games));
    }
  }

  private async calculateDartResult(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch && pansch.id) {
      pansch.dartCalculationStarted = true;
      await this.latschiPanschService.updatePansch(pansch);
      const currentPlayers: Player[] = await this.playerService.getPlayerSnapshot(pansch);
      currentPlayers.sort((a, b) => {
        if (a.dartWinner) return -1;
        if (b.dartWinner) return 1;
        if (a.dartScoreFinal && b.dartScoreFinal) return a.dartScoreFinal - b.dartScoreFinal;
        if (a.dartScoreFinal) return -1;
        if (b.dartScoreFinal) return 1;
        return a.dartScorePreliminaryRound! - b.dartScorePreliminaryRound!;
      });
      let rank = 1;
      let tempRank = 0;
      let tempFinalScore: number | undefined = 0;
      let tempPreliminaryScore: number | undefined = 0;

      for (let i = 0; i < currentPlayers.length; i++) {
        const player = currentPlayers[i];
        if (player.dartScoreFinal === tempFinalScore && player.dartScorePreliminaryRound === tempPreliminaryScore) {
          tempRank++;
        } else {
          rank += tempRank;
          tempFinalScore = player.dartScoreFinal;
          tempPreliminaryScore = player.dartScorePreliminaryRound;
          tempRank = 1;
        }
        player.dartRank = rank;
        player.totalPoints = (player.totalPoints ?? 0) + (17 - player.dartRank);

        if (player.dartRank === 1) {
          if (!player.wins) {
            player.wins = [];
          }
          player.wins.push(DisciplineIconName.dart);
        }
        await this.playerService.updatePlayer(pansch, player);
      }
      pansch.dartCalculationFinished = true;
      await this.latschiPanschService.updatePansch(pansch);
      await this.latschiPanschService.calculateFinalResult();
    }
  }

  private getRandomDartScore(): number {
    return Math.floor(Math.random() * 100) + 1;
  }
}
