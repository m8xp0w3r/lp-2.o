import { Component, inject } from '@angular/core';
import { RankingService } from "@pages/disciplines/ranking/ranking.service";
import { Observable } from "rxjs";
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HeaderComponent } from "@components";
import { AuthService } from "@services";
import { Player } from "@interfaces";
import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonNote } from "@ionic/angular/standalone";

@Component({
    selector: 'lp-ranking',
    templateUrl: './ranking.page.html',
    styleUrls: ['./ranking.page.scss'],
    imports: [
        HeaderComponent,
        NgIf,
        NgFor,
        AsyncPipe,
        IonContent,
        IonLabel,
        IonItem,
        IonList,
        IonIcon,
        IonNote
    ]
})
export class RankingPage {
  private rankingService: RankingService = inject(RankingService);
  public players$: Observable<Player[]> = this.rankingService.players$;
  public coinFlipNeeded$ = this.rankingService.coinFlipNeeded$;
  private authService: AuthService = inject(AuthService);
  public currentUser$ = this.authService.currentUser$;
}
