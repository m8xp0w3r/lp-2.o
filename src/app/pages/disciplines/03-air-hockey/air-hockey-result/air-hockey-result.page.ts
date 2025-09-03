import { Component, inject } from '@angular/core';
import { combineLatest, map, Observable } from "rxjs";
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { LatschiPanschService } from "@services";
import { HeaderComponent } from "@components";
import { LatschiPansch, Player } from "@interfaces";
import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonNote } from "@ionic/angular/standalone";

@Component({
    selector: 'lp-air-hockey-result',
    templateUrl: './air-hockey-result.page.html',
    styleUrls: ['./air-hockey-result.page.scss'],
    imports: [
        HeaderComponent,
        NgIf,
        NgFor,
        AsyncPipe,
        IonIcon,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        IonNote,
    ]
})
export class AirHockeyResultPage {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  public currentPansch$: Observable<LatschiPansch | undefined> = this.latschiPanschService.currentPansch$;

  public players$: Observable<Player[]> = combineLatest([this.latschiPanschService.players$, this.currentPansch$])
    .pipe(map(([players, currentPansch]) => {
      players.sort((a, b) => (a.airHockeyRank ?? 0) - (b.airHockeyRank ?? 0));
      if (currentPansch && currentPansch.isReleased) {
        return players;
      }
      return players.filter(player => player.airHockeyRank === 1);
    }));
}
