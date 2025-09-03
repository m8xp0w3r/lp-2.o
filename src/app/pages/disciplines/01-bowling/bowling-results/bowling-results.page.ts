import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonLabel, IonList, IonNote } from '@ionic/angular/standalone';
import { HeaderComponent } from "@components";
import { LatschiPanschService } from "@services";
import { combineLatest, map, Observable } from "rxjs";
import { LatschiPansch, Player } from "@interfaces";

@Component({
  selector: 'lp-bowling-results',
  templateUrl: './bowling-results.page.html',
  styleUrls: ['./bowling-results.page.scss'],
  imports: [IonContent, CommonModule, FormsModule, HeaderComponent, IonList, IonItem, IonLabel, IonNote],
})
export class BowlingResultsPage {

  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  public currentPansch$: Observable<LatschiPansch | undefined> = this.latschiPanschService.currentPansch$;
  public players$: Observable<Player[]> = combineLatest([this.latschiPanschService.players$, this.currentPansch$])
  .pipe(map(([players, currentPansch]) => {
    if (!currentPansch || !currentPansch.isReleased) {
      return [...players.filter(player => player.bowlingRank === 1)];
    }
    players.sort((a, b) => (a.bowlingRank ?? 0) - (b.bowlingRank ?? 0));
    return [...players];
  }));

}
