import { inject, Injectable } from "@angular/core";
import { LatschiPanschService, PlayerService } from "@services";
import { Router } from "@angular/router";
import { LatschiPansch, Player } from "@interfaces";
import { firstValueFrom, Observable } from "rxjs";
import { DisciplineIconName } from "@enums";

@Injectable({
  providedIn: 'root',
})
export class BowlingService {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  private playerService: PlayerService = inject(PlayerService);
  private router: Router = inject(Router);

  public async updatePlayer(player: Player): Promise<void> {
    const pansch: LatschiPansch | undefined = this.latschiPanschService.getSelectedPansch();
    if (pansch) {
      await this.playerService.updatePlayer(pansch, player);
    }
  }

  public async calculateResult(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch && pansch.id && !pansch.bowlingCalculationStarted) {
      pansch.bowlingCalculationStarted = true;
      await this.latschiPanschService.updatePansch(pansch);
      const currentPlayers: Player[] = await this.playerService.getPlayerSnapshot(pansch);
      currentPlayers.sort((a, b) => (b.bowlingPins ?? 0) - (a.bowlingPins ?? 0));
      let rank = 1;
      let tempRank = 0;
      let tempPinCount: number = currentPlayers[0].bowlingPins!;
      for (let i = 0; i < currentPlayers.length; i++) {
        const player = currentPlayers[i];
        if (player.bowlingPins === tempPinCount) {
          tempRank++;
        } else {
          rank += tempRank;
          tempPinCount = player.bowlingPins!;
          tempRank = 1;
        }
        player.bowlingRank = rank;
        player.totalPoints = (player.totalPoints ?? 0) + (17 - player.bowlingRank);
        if (player.bowlingRank === 1) {
          if (!player.wins) {
            player.wins = [];
          }
          player.wins.push(DisciplineIconName.bowling);
        }

        await this.playerService.updatePlayer(pansch, player);
      }
      pansch.bowlingCalculationFinished = true;
      await this.latschiPanschService.updatePansch(pansch);
      await this.latschiPanschService.initBilliardGames();
      void this.router.navigate(["/bowling/bowling-results"]);
    }
  }

  public async calculateFakeResult(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch && pansch.id) {
      pansch.fakeBowlingCalculationStarted = true;
      await this.latschiPanschService.updatePansch(pansch);
      const players$: Observable<Player[]> = this.latschiPanschService.players$;
      if (players$) {
        const currentPlayers: Player[] = await firstValueFrom(players$);
        for (let i = 0; i < currentPlayers.length; i++) {
          const player = currentPlayers[i];
          player.bowlingPins = Math.floor(Math.random() * 100) + 1;

          await this.playerService.updatePlayer(pansch, player);
        }
      }
    }
  }
}
