import { Component, inject } from '@angular/core';
import { combineLatest, map, Observable } from "rxjs";
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HeaderComponent } from "@components";
import { LatschiPanschService } from "@services";
import { LatschiPansch, Player } from "@interfaces";
import { IonContent, IonItem, IonLabel, IonList, IonNote } from "@ionic/angular/standalone";

@Component({
  selector: 'lp-billiard-result',
  templateUrl: './billiard-result.page.html',
  styleUrls: ['./billiard-result.page.scss'],
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
export class BilliardResultPage {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  public currentPansch$: Observable<LatschiPansch | undefined> = this.latschiPanschService.currentPansch$;
  public players$: Observable<Player[]> = combineLatest([this.latschiPanschService.players$, this.currentPansch$])
  .pipe(map(([players, currentPansch]) => {
    players.sort((a, b) => (a.billiardRank ?? 0) - (b.billiardRank ?? 0));
    if (currentPansch && currentPansch.isReleased) {
      return players;
    }
    return players.filter(player => player.billiardRank === 1);
  }));

}
