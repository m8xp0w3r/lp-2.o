import { Component } from '@angular/core';
import { BaseAirHockeyPage } from "@pages/disciplines/03-air-hockey/base-air-hockey.page";
import { firstValueFrom, Observable } from "rxjs";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { GameCardComponent, PanschWaitingComponent } from "@components";
import { Game } from "@interfaces";
import { PanschKey } from "@types";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonMenuButton,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";


@Component({
    selector: 'lp-air-hockey-final',
    templateUrl: './air-hockey-final.page.html',
    styleUrls: ['./air-hockey-final.page.scss'],
    imports: [
        NgIf,
        NgFor,
        GameCardComponent,
        PanschWaitingComponent,
        AsyncPipe,
        IonToolbar,
        IonHeader,
        IonButtons,
        IonMenuButton,
        IonTitle,
        IonButton,
        IonIcon,
        IonContent,
        IonList,
    ]
})
export class AirHockeyFinalPage extends BaseAirHockeyPage {
  public airHockeyFinalGames$: Observable<Game[]> = this.airHockeyService.airHockeyFinalGames$;
  public disableSave$: Observable<boolean> = this.airHockeyService.disableFinalSave$;
  public calcStartedKey: PanschKey = "airHockeyFinalCalculationStarted";

  public async calculateResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.airHockeyFinalGames$);
    await this.airHockeyService.addAirHockeyScore(games);
    await this.airHockeyService.calculateResult();
  }

  public async calculateFakeResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.airHockeyFinalGames$);
    await this.airHockeyService.calculateFakeAirHockeyScore<"fakeAirHockeyFinalCalculationStarted">(games, "fakeAirHockeyFinalCalculationStarted");
  }
}
