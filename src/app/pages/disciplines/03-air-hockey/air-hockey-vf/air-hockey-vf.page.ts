import { Component } from '@angular/core';
import { BaseAirHockeyPage } from "@pages/disciplines/03-air-hockey/base-air-hockey.page";
import { firstValueFrom, Observable } from "rxjs";

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
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { GameCardComponent, PanschWaitingComponent } from "@components";
import { Game } from "@interfaces";
import { PanschKey } from "@types";

@Component({
  selector: 'lp-air-hockey-vf',
  templateUrl: './air-hockey-vf.page.html',
  styleUrls: ['./air-hockey-vf.page.scss'],
  standalone: true,
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
  ],
})
export class AirHockeyVfPage extends BaseAirHockeyPage {
  public airHockeyVfGames$: Observable<Game[]> = this.airHockeyService.airHockeyVfGames$;
  public disableSave$: Observable<boolean> = this.airHockeyService.disableVfSave$;
  public calcStartedKey: PanschKey = "airHockeyVfCalculationStarted";

  public async calculateResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.airHockeyVfGames$);
    await this.airHockeyService.addAirHockeyScore(games);
    await this.latschiPanschService.updatePanschItem("airHockeyVfCalculationStarted");
    await this.airHockeyService.initNextRound("airHockeyHfGames", games);
    await this.latschiPanschService.updatePanschItem("airHockeyVfCalculationFinished");
    void this.router.navigate(['/air-hockey/air-hockey-hf']);
  }

  public async calculateFakeResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.airHockeyVfGames$);
    await this.airHockeyService.calculateFakeAirHockeyScore<"fakeAirHockeyVfCalculationStarted">(games, "fakeAirHockeyVfCalculationStarted");
  }

}
