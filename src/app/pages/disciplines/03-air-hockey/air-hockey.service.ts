import { inject, Injectable } from '@angular/core';
import { FirestoreService, GameService, LatschiPanschService, PlayerService } from "@services";
import { Router } from "@angular/router";
import { BehaviorSubject, combineLatest, firstValueFrom, map, Observable } from "rxjs";
import { Game, LatschiPansch, Player } from "@interfaces";
import { CollectionUtil } from "@util/collection.util";
import { DisciplineIconName } from "@enums";
import { PanschKey } from "@types";

@Injectable({
  providedIn: 'root',
})
export class AirHockeyService {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);

  private firestoreService: FirestoreService = inject(FirestoreService);
  private playerService: PlayerService = inject(PlayerService);
  private gameService: GameService = inject(GameService);
  private router: Router = inject(Router);
  private airHockeyAfGamesSubject: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);
  public airHockeyAfGames$: Observable<Game[]> = this.airHockeyAfGamesSubject.pipe(
    map(games => games.sort((a, b) => a.gameNumber - b.gameNumber)));
  private airHockeyVfGamesSubject: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);
  public airHockeyVfGames$: Observable<Game[]> = this.airHockeyVfGamesSubject.pipe(
    map(games => games.sort((a, b) => a.gameNumber - b.gameNumber)));
  private airHockeyHfGamesSubject: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);
  public airHockeyHfGames$: Observable<Game[]> = this.airHockeyHfGamesSubject.pipe(
    map(games => games.sort((a, b) => a.gameNumber - b.gameNumber)));
  private airHockeyFinalGameSubject: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);
  public airHockeyFinalGames$: Observable<Game[]> = this.airHockeyFinalGameSubject.asObservable();

  public disableAfSave$: Observable<boolean> = combineLatest([this.airHockeyAfGames$, this.latschiPanschService.currentPansch$])
  .pipe(
    map(([games, currentPansch]) => games
    .filter(game => game.team1.score === undefined || !game.team2.score === undefined || game.team1.score === game.team2.score).length > 0 || (currentPansch?.airHockeyAfCalculationStarted ?? false)),
  );
  public disableVfSave$: Observable<boolean> = combineLatest([this.airHockeyVfGames$, this.latschiPanschService.currentPansch$])
  .pipe(
    map(([games, currentPansch]) => games
    .filter(game => !game.team1.score === undefined || !game.team2.score === undefined || game.team1.score === game.team2.score).length > 0 || (currentPansch?.airHockeyVfCalculationStarted ?? false)),
  );
  public disableHfSave$: Observable<boolean> = combineLatest([this.airHockeyHfGames$, this.latschiPanschService.currentPansch$])
  .pipe(
    map(([games, currentPansch]) => games
    .filter(game => !game.team1.score === undefined || !game.team2.score === undefined || game.team1.score === game.team2.score).length > 0 || (currentPansch?.airHockeyHfCalculationStarted ?? false)),
  );
  public disableFinalSave$: Observable<boolean> = combineLatest([this.airHockeyFinalGames$, this.latschiPanschService.currentPansch$])
  .pipe(
    map(([games, currentPansch]) => games
    .filter(game => !game.team1.score === undefined || !game.team2.score === undefined || game.team1.score === game.team2.score).length > 0 || (currentPansch?.airHockeyFinalCalculationStarted ?? false)),
  );

  constructor() {
    void this.getGames();
  }

  public async addAirHockeyScore(games: Game[]): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch) {
      for (let i = 0; i < games.length; i++) {
        const game = games[i];
        await this.updatePlayer(game.team1.player1, game.team1.score ?? 0, (game.team1.score ?? 0) - (game.team2.score ?? 0), pansch);
        await this.updatePlayer(game.team2.player1, game.team2.score ?? 0, (game.team2.score ?? 0) - (game.team1.score ?? 0), pansch);
      }
    }
  }

  public async initNextRound(subCollectionName: string, games: Game[]): Promise<void> {
    const currentPansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (currentPansch && currentPansch.id) {
      const airHockeySubCollectionName: string = CollectionUtil.getSubCollectionName(currentPansch.collectionName, currentPansch.id, subCollectionName);
      const length = games.length - 1;
      for (let i = 0; i < games.length / 2; i++) {
        const team1 = this.gameService.getWinningTeamOf(games[i]);
        team1.collectionName = airHockeySubCollectionName;
        team1.score = 0;
        const team2 = this.gameService.getWinningTeamOf(games[length - i]);
        team2.collectionName = airHockeySubCollectionName;
        team2.score = 0;
        const game: Game = {
          collectionName: airHockeySubCollectionName,
          finished: false,
          gameNumber: i + 1,
          team1: team1,
          team2: team2,
        };
        await this.firestoreService.addItem<Game>(game.collectionName, game);
      }
    }
  }

  public async calculateResult(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch && pansch.id) {
      pansch.airHockeyCalculationStarted = true;
      pansch.airHockeyFinalCalculationStarted = true;
      await this.latschiPanschService.updatePansch(pansch);
      const currentPlayers: Player[] = await this.firestoreService.getSnapshot<Player>(CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "players"));
      currentPlayers.sort((a, b) => {
        if (a.airHockeyWins !== b.airHockeyWins) {
          return (b.airHockeyWins ?? 0) - (a.airHockeyWins ?? 0);
        }
        if (a.airHockeyDiff !== b.airHockeyDiff) {
          return (b.airHockeyDiff ?? 0) - (a.airHockeyDiff ?? 0);
        }
        return (b.airHockeyGoals ?? 0) - (a.airHockeyGoals ?? 0);
      });
      let rank = 1;
      let tempRank = 0;
      let tempAirHockeyGoals: number = currentPlayers[0].airHockeyGoals!;
      let tempAirHockeyWins: number = currentPlayers[0].airHockeyWins!;
      let tempAirHockeyDiff: number = currentPlayers[0].airHockeyDiff!;
      for (let i = 0; i < currentPlayers.length; i++) {
        const player = currentPlayers[i];
        if (player.airHockeyGoals === tempAirHockeyGoals && player.airHockeyDiff === tempAirHockeyDiff && player.airHockeyWins === tempAirHockeyWins) {
          tempRank++;
        } else {
          rank += tempRank;
          tempAirHockeyGoals = player.airHockeyGoals!;
          tempAirHockeyWins = player.airHockeyWins!;
          tempAirHockeyDiff = player.airHockeyDiff!;
          tempRank = 1;
        }
        player.airHockeyRank = rank;
        player.totalPoints = (player.totalPoints ?? 0) + (17 - player.airHockeyRank);

        if (player.airHockeyRank === 1) {
          if (!player.wins) {
            player.wins = [];
          }
          player.wins.push(DisciplineIconName.airHockey);
        }

        await this.playerService.updatePlayer(pansch, player);
      }
      pansch.airHockeyCalculationFinished = true;
      pansch.airHockeyFinalCalculationFinished = true;
      await this.latschiPanschService.updatePansch(pansch);
      await this.latschiPanschService.initKickerGames();
      void this.router.navigate(["/air-hockey/air-hockey-result"]);
    }
  }

  public async calculateFakeAirHockeyScore<KEY extends PanschKey>(games: Game[], panschKey: KEY): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch) {
      await this.latschiPanschService.updatePanschItem(panschKey);
      await this.gameService.calculateFakeResult(games);
    }
  }

  private async getGames(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch && pansch.id) {
      const billiardGamesCollectionName = CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "airHockeyGames");
      const billiardVfGamesCollectionName = CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "airHockeyVfGames");
      const billiardHfGamesCollectionName = CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "airHockeyHfGames");
      const billiardFinalGamesCollectionName = CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "airHockeyFinalGames");
      (await this.gameService.getGames<Game>(billiardGamesCollectionName)).subscribe(games => this.airHockeyAfGamesSubject.next(games));
      (await this.gameService.getGames<Game>(billiardVfGamesCollectionName)).subscribe(games => this.airHockeyVfGamesSubject.next(games));
      (await this.gameService.getGames<Game>(billiardHfGamesCollectionName)).subscribe(games => this.airHockeyHfGamesSubject.next(games));
      (await this.gameService.getGames<Game>(billiardFinalGamesCollectionName)).subscribe(games => this.airHockeyFinalGameSubject.next(games));
    }
  }

  private async updatePlayer(player: Player, score: number, diff: number, pansch: LatschiPansch): Promise<void> {
    player.airHockeyGoals = score + (player.airHockeyGoals ?? 0);
    player.airHockeyDiff = diff + (player.airHockeyDiff ?? 0);
    if (diff > 0) player.airHockeyWins = (player.airHockeyWins ?? 0) + 1;
    await this.playerService.updatePlayer(pansch, player);
  }
}
