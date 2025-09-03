import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HeaderComponent } from "@components";
import { LatschiPanschService } from "@services";
import { combineLatest, map, Observable } from "rxjs";
import { LatschiPansch, Player } from "@interfaces";
import { IonContent, IonItem, IonLabel, IonList, IonNote } from "@ionic/angular/standalone";

@Component({
  selector: 'lp-bonus-results',
  templateUrl: './bonus-results.page.html',
  styleUrls: ['./bonus-results.page.scss'],
  imports: [
    HeaderComponent,
    NgIf,
    NgFor,
    AsyncPipe,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
  ],
})
export class BonusResultsPage {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  public currentPansch$: Observable<LatschiPansch | undefined> = this.latschiPanschService.currentPansch$;
  public players$: Observable<Player[]> = combineLatest([this.latschiPanschService.players$, this.currentPansch$])
  .pipe(map(([players, currentPansch]) => {
    players.sort((a, b) => (a.bonusRank ?? 16) - (b.bonusRank ?? 16));
    if (currentPansch && currentPansch.isReleased) {
      return players;
    }
    return players.filter(player => player.bonusRank === 1);
  }));
}
