import { inject, Injectable } from "@angular/core";
import { FirestoreService, GameService, LatschiPanschService, PlayerService } from "@services";
import { Router } from "@angular/router";
import { BehaviorSubject, combineLatest, firstValueFrom, map, Observable } from "rxjs";
import { Game, LatschiPansch, Player } from "@interfaces";
import { CollectionUtil } from "@util/collection.util";
import { PanschKey } from "@types";
import { DisciplineIconName } from "@enums";


@Injectable({
  providedIn: 'root'
})
export class KickerService {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  private firestoreService: FirestoreService = inject(FirestoreService);
  private playerService: PlayerService = inject(PlayerService);
  private gameService: GameService = inject(GameService);
  private router: Router = inject(Router);

  private kickerVfGamesSubject: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);
  private kickerHfGamesSubject: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);
  private kickerFinalGamesSubject: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);
  private kickerFinalGameSubject: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);

  public kickerVfGames$: Observable<Game[]> = this.kickerVfGamesSubject.pipe(
    map((games: Game[]) => games.sort((a, b) => a.gameNumber - b.gameNumber)));
  public kickerHfGames$: Observable<Game[]> = this.kickerHfGamesSubject.pipe(
    map(games => games.sort((a, b) => a.gameNumber - b.gameNumber)));
  public kickerFinalGames$: Observable<Game[]> = this.kickerFinalGamesSubject.asObservable();
  public kickerFinalGame$: Observable<Game[]> = this.kickerFinalGameSubject.asObservable();

  public disableVfSave$: Observable<boolean> = combineLatest([this.kickerVfGames$, this.latschiPanschService.currentPansch$])
    .pipe(
      map(([games, currentPansch]) => games
        .filter(game => !game.team1.score === undefined || !game.team2.score === undefined || game.team1.score === game.team2.score).length > 0 || (currentPansch?.kickerVfCalculationStarted ?? false))
    );
  public disableHfSave$: Observable<boolean> = combineLatest([this.kickerHfGames$, this.latschiPanschService.currentPansch$])
    .pipe(
      map(([games, currentPansch]) => games
        .filter(game => !game.team1.score === undefined || !game.team2.score  === undefined|| game.team1.score === game.team2.score).length > 0 || (currentPansch?.kickerHfCalculationStarted ?? false))
    );
  public disableFinalSave$: Observable<boolean> = combineLatest([this.kickerFinalGames$, this.latschiPanschService.currentPansch$])
    .pipe(
      map(([games, currentPansch]) => games
        .filter(game => !game.team1.score === undefined || !game.team2.score === undefined || game.team1.score === game.team2.score).length > 0 || (currentPansch?.kickerFinalCalculationStarted ?? false))
    );
  public disableSave$: Observable<boolean> = combineLatest([this.kickerFinalGame$, this.latschiPanschService.currentPansch$])
    .pipe(
      map(([games, currentPansch]) => games
          .filter(game => !game.team1.score === undefined || !game.team2.score === undefined || game.team1.score === game.team2.score).length > 0 || (currentPansch?.kickerCalculationStarted ?? false))
    );

  constructor() {
    void this.getGames();
  }

  private async getGames(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch && pansch.id) {
      const kickerGamesCollectionName = CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "kickerGames");
      const kickerHfGamesCollectionName = CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "kickerHfGames");
      const kickerFinalGamesCollectionName = CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "kickerFinalGames");
      const kickerFinalGameCollectionName = CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "kickerFinalGame");
      (await this.gameService.getGames<Game>(kickerGamesCollectionName)).subscribe(games => this.kickerVfGamesSubject.next(games));
      (await this.gameService.getGames<Game>(kickerHfGamesCollectionName)).subscribe(games => this.kickerHfGamesSubject.next(games));
      (await this.gameService.getGames<Game>(kickerFinalGamesCollectionName)).subscribe(games => this.kickerFinalGamesSubject.next(games));
      (await this.gameService.getGames<Game>(kickerFinalGameCollectionName)).subscribe(games => this.kickerFinalGameSubject.next(games));
    }
  }

  public async addKickerScore(games: Game[]): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch) {
      for (let i = 0; i < games.length; i++) {
        const game = games[i];
        await this.updatePlayer(game.team1.player1, game.team1.score ?? 0, (game.team1.score ?? 0) - (game.team2.score ?? 0), pansch);
        if (game.team1.player2) {
          await this.updatePlayer(game.team1.player2, game.team1.score ?? 0, (game.team1.score ?? 0) - (game.team2.score ?? 0), pansch);
        }
        await this.updatePlayer(game.team2.player1, game.team2.score ?? 0, (game.team2.score ?? 0) - (game.team1.score ?? 0), pansch);
        if (game.team2.player2) {
          await this.updatePlayer(game.team2.player2, game.team2.score ?? 0, (game.team2.score ?? 0) - (game.team1.score ?? 0), pansch);
        }
      }
    }
  }

  public async calculateFakeKickerScore<KEY extends PanschKey>(games: Game[], panschKey: KEY): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch) {
      await this.latschiPanschService.updatePanschItem(panschKey);
      await this.gameService.calculateFakeResult(games);
    }
  }

  public async initNextRound(subCollectionName: string, games: Game[]): Promise<void> {
    const currentPansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (currentPansch && currentPansch.id) {
      const kickerSubCollectionName: string = CollectionUtil.getSubCollectionName(currentPansch.collectionName, currentPansch.id, subCollectionName);
      const length = games.length - 1;
      for (let i = 0; i < games.length / 2; i++) {
        const team1 = this.gameService.getWinningTeamOf(games[i]);
        team1.collectionName = kickerSubCollectionName;
        team1.score = 0;
        const team2 = this.gameService.getWinningTeamOf(games[length - i]);
        team2.collectionName = kickerSubCollectionName;
        team2.score = 0;
        const game: Game = {
          collectionName: kickerSubCollectionName,
          finished: false,
          gameNumber: i + 1,
          team1: team1,
          team2: team2
        };
        await this.firestoreService.addItem<Game>(game.collectionName, game);
      }
    }
  }

  public async initFinalGame(games: Game[]): Promise<void> {
    const currentPansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (currentPansch && currentPansch.id) {
      const kickerSubCollectionName: string = CollectionUtil.getSubCollectionName(currentPansch.collectionName, currentPansch.id, "kickerFinalGame");
      const winningTeam = this.gameService.getWinningTeamOf(games[0]);
      const game: Game = {
        collectionName: kickerSubCollectionName,
        finished: false,
        gameNumber: 1,
        team1: {
          player1: winningTeam.player1,
          collectionName: kickerSubCollectionName,
          score: 0
        },
        team2: {
          player1: winningTeam.player2!,
          collectionName: kickerSubCollectionName,
          score: 0
        }
      };
      await this.firestoreService.addItem<Game>(game.collectionName, game);
    }
  }

  public async calculateResult(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch && pansch.id) {
      pansch.kickerCalculationStarted = true;
      await this.latschiPanschService.updatePansch(pansch);
      const currentPlayers: Player[] = await this.playerService.getPlayerSnapshot(pansch);
      currentPlayers.sort((a, b) => {
        if (a.kickerWins !== b.kickerWins) {
          return (b.kickerWins ?? 0) - (a.kickerWins ?? 0);
        }
        if (a.kickerDiff !== b.kickerDiff) {
          return (b.kickerDiff ?? 0) - (a.kickerDiff ?? 0);
        }
        return (b.kickerGoals ?? 0) - (a.kickerGoals ?? 0);
      });
      let rank = 1;
      let tempRank = 0;
      let tempKickerGoals: number = currentPlayers[0].kickerGoals!;
      let tempKickerWins: number = currentPlayers[0].kickerWins!;
      let tempKickerDiff: number = currentPlayers[0].kickerDiff!;
      for (let i = 0; i < currentPlayers.length; i++) {
        const player = currentPlayers[i];
        if (player.kickerGoals === tempKickerGoals && player.kickerDiff === tempKickerDiff && player.kickerWins === tempKickerWins) {
          tempRank++;
        } else {
          rank += tempRank;
          tempKickerGoals = player.kickerGoals!;
          tempKickerWins = player.kickerWins!;
          tempKickerDiff = player.kickerDiff!;
          tempRank = 1;
        }
        player.kickerRank = rank;
        player.totalPoints = (player.totalPoints ?? 0) + (17 - player.kickerRank);

        if (player.kickerRank === 1) {
          if (!player.wins) {
            player.wins = [];
          }
          player.wins.push(DisciplineIconName.kicker);
        }

        await this.playerService.updatePlayer(pansch, player);
      }
      pansch.kickerCalculationFinished = true;
      await this.latschiPanschService.updatePansch(pansch);
      await this.latschiPanschService.initDart();
      void this.router.navigate(["/kicker/kicker-result"]);
    }
  }

  private async updatePlayer(player: Player, score: number, diff: number, pansch: LatschiPansch): Promise<void> {
    player.kickerGoals = score + (player.kickerGoals ?? 0);
    player.kickerDiff = diff + (player.kickerDiff ?? 0);
    if (diff > 0) player.kickerWins = (player.kickerWins ?? 0) + 1;
    await this.playerService.updatePlayer(pansch, player);
  }
}
