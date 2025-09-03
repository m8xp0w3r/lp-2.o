import { Component } from '@angular/core';
import { BaseDartPage } from "@pages/disciplines/05-dart/base-dart.page";
import { firstValueFrom, Observable } from "rxjs";
import { HeaderComponent, PanschWaitingComponent } from "@components";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { DartPlayerPipe } from "@pages/disciplines/05-dart/dart-player-pipe/dart-player.pipe";
import { DartGame } from "@interfaces";
import {
  IonButton,
  IonContent,
  IonFooter,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote
} from "@ionic/angular/standalone";


@Component({
    selector: 'lp-dart-final',
    templateUrl: './dart-final.page.html',
    styleUrls: ['./dart-final.page.scss'],
    imports: [
        HeaderComponent,
        NgIf,
        NgFor,
        PanschWaitingComponent,
        AsyncPipe,
        DartPlayerPipe,
        IonContent,
        IonList,
        IonListHeader,
        IonLabel,
        IonItem,
        IonNote,
        IonFooter,
        IonButton,
        IonIcon
    ]
})
export class DartFinalPage extends BaseDartPage {
  public finalGame$: Observable<DartGame | undefined> = this.dartService.dartFinalGame$;
  public finalRoundFinished$: Observable<boolean> = this.dartService.finalRoundFinished$;


  public async calculateFinal(): Promise<void> {
    await this.dartService.calculateFinal();
  }

  public async calculateFakeResult(): Promise<void> {
    const dartGame: DartGame | undefined = await firstValueFrom(this.finalGame$);
    if (dartGame) {
      await this.dartService.calculateFakeScore(dartGame);
    }
  }
}
