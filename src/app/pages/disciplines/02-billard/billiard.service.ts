import { inject, Injectable } from '@angular/core';
import { LatschiPanschService } from "@services/latschi-pansch.service";
import { BehaviorSubject, combineLatest, firstValueFrom, map, Observable } from "rxjs";
import { LatschiPansch } from "@models/latschi-pansch.interface";
import { CollectionUtil } from "@util/collection.util";
import { Game } from "@models/game.interface";
import { GameService } from "@services/game.service";
import { Player } from "@models/player.model";
import { PlayerService } from "@services/player.service";
import { Router } from "@angular/router";
import { Team } from "@models/team.interface";
import { DisciplineIconName } from "@models/discipline-icon-name.enum";


@Injectable({
  providedIn: 'root'
})
export class BilliardService {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  private playerService: PlayerService = inject(PlayerService);
  private gameService: GameService = inject(GameService);
  private router: Router = inject(Router);

  private billiardGamesSubject: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);
  public billiardGames$: Observable<Game[]> = this.billiardGamesSubject.pipe(
    map(games => games.sort((a, b) => a.gameNumber - b.gameNumber)));
  public disableSave$: Observable<boolean> = combineLatest([this.billiardGames$, this.latschiPanschService.currentPansch$])
    .pipe(
      map(([games, currentPansch]) => games
        .filter(game => !game.team1.score || !game.team2.score).length > 0 || (currentPansch?.billiardCalculationStarted ?? false))
    );

  constructor() {
    void this.getGames();
  }

  private async getGames(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch && pansch.id) {
      const billiardGamesCollectionName = CollectionUtil.getSubCollectionName(pansch.collectionName, pansch.id, "billiardGames");
      (await this.gameService.getGames<Game>(billiardGamesCollectionName)).subscribe(games => this.billiardGamesSubject.next(games));
    }
  }

  public async setBilliardResult(games: Game[]): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch) {
      for (let i = 0; i < games.length; i++) {
        const game = games[i];
        await this.updatePlayer(game.team1.player1, game.team1.score ?? 0, pansch);
        await this.updatePlayer(game.team2.player1, game.team2.score ?? 0, pansch);
      }
    }
  }

  public async calculateResult(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch) {
      pansch.billiardCalculationStarted = true;
      await this.latschiPanschService.updatePansch(pansch);
      const currentPlayers: Player[] = await this.playerService.getPlayerSnapshot(pansch);
      currentPlayers.sort((a, b) => (a.billiardHits ?? 0) - (b.billiardHits ?? 0));
      let rank = 1;
      let tempRank = 0;
      let tempPinCount: number = currentPlayers[0].billiardHits!;
      for (let i = 0; i < currentPlayers.length; i++) {
        const player = currentPlayers[i];
        if (player.billiardHits === tempPinCount) {
          tempRank++;
        } else {
          rank += tempRank;
          tempPinCount = player.billiardHits!;
          tempRank = 1;
        }
        player.billiardRank = rank;
        player.totalPoints = (player.totalPoints ?? 0) + (17 - player.billiardRank);

        if (player.billiardRank === 1) {
          if (!player.wins) {
            player.wins = [];
          }
          player.wins.push(DisciplineIconName.billiard);
        }

        await this.playerService.updatePlayer(pansch, player);
      }
      pansch.billiardCalculationFinished = true;
      await this.latschiPanschService.updatePansch(pansch);
      await this.latschiPanschService.initAirHockeyGames();
      void this.router.navigate(["/billiard/billiard-results"]);
    }
  }

  public async calculateFakeResult(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch) {
      pansch.fakeBilliardCalculationStarted = true;
      await this.latschiPanschService.updatePansch(pansch);
      const games: Game[] = await firstValueFrom(this.billiardGames$);
      await this.gameService.calculateFakeResult(games);
      await this.setBilliardResult(games);
    }
  }

  private async updatePlayer(player: Player, score: number, pansch: LatschiPansch): Promise<void> {
    player.billiardHits = score;
    await this.playerService.updatePlayer(pansch, player);
  }
}
