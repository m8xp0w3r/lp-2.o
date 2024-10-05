import { inject, Injectable } from '@angular/core';
import { LatschiPanschService, PlayerService } from "@services";
import { Router } from "@angular/router";
import { BehaviorSubject, firstValueFrom, Observable } from "rxjs";
import { BonusSortingOrder, DisciplineIconName } from "@enums";
import { LatschiPansch, Player } from "@interfaces";


@Injectable({
  providedIn: 'root'
})
export class BonusService {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  private playerService: PlayerService = inject(PlayerService);
  private router: Router = inject(Router);

  private selectedSortingOrderSubject: BehaviorSubject<BonusSortingOrder | undefined> = new BehaviorSubject<BonusSortingOrder | undefined>(undefined);
  public selectedSortingOrder$: Observable<BonusSortingOrder | undefined> = this.selectedSortingOrderSubject.asObservable();

  public async updatePlayer(player: Player): Promise<void> {
    const pansch: LatschiPansch | undefined = this.latschiPanschService.getSelectedPansch();
    if (pansch) {
      void this.playerService.updatePlayer(pansch, player);
    }
  }

  public sortAscending = (a: Player, b: Player) => (b.bonusScore ?? 0) - (a.bonusScore ?? 0);
  public sortDescending = (a: Player, b: Player) => (a.bonusScore ?? 0) - (b.bonusScore ?? 0);

  public updateSelectedSortingOrder(sortingOrder: BonusSortingOrder): void {
    this.selectedSortingOrderSubject.next(sortingOrder);
  }

  public async calculateResult(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    console.log("calculate result", pansch);
    if (pansch && !pansch.bonusCalculationStarted) {
      pansch.bonusCalculationStarted = true;
      await this.latschiPanschService.updatePansch(pansch);
      const currentPlayers: Player[] = await this.playerService.getPlayerSnapshot(pansch);
      const sortingOrder: BonusSortingOrder | undefined = await firstValueFrom(this.selectedSortingOrder$);
      if (sortingOrder === undefined) {
        pansch.bonusCalculationStarted = false;
        await this.latschiPanschService.updatePansch(pansch);
        return;
      }
      currentPlayers.sort(sortingOrder === BonusSortingOrder.descending ? this.sortAscending : this.sortDescending);
      let rank = 1;
      let tempRank = 0;
      let tempBonusScore: number = currentPlayers[0].bonusScore!;
      for (let i = 0; i < currentPlayers.length; i++) {
        const player = currentPlayers[i];
        if (player.bonusScore === tempBonusScore) {
          tempRank++;
        } else {
          rank += tempRank;
          tempBonusScore = player.bonusScore!;
          tempRank = 1;
        }
        player.bonusRank = rank;
        if (player.bonusRank === 1) {
          if (!player.wins) {
            player.wins = [];
          }
          player.wins.push(DisciplineIconName.bonus);
        }

        await this.playerService.updatePlayer(pansch, player);
      }
      pansch.bonusCalculationFinished = true;
      await this.latschiPanschService.updatePansch(pansch);
      void this.router.navigate(["/bonus/bonus-results"]);
    }
  }

  public async calculateFakeResult(): Promise<void> {
    const pansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (pansch) {
      pansch.fakeBonusCalculationStarted = true;
      await this.latschiPanschService.updatePansch(pansch);
      const players$: Observable<Player[]> | undefined = this.latschiPanschService.players$;
      if (players$) {
        const currentPlayers: Player[] = await firstValueFrom(players$);
        for (let i = 0; i < currentPlayers.length; i++) {
          const player = currentPlayers[i];
          player.bonusScore = Math.floor(Math.random() * 100);

          await this.playerService.updatePlayer(pansch, player);
        }
      }
    }
  }
}
