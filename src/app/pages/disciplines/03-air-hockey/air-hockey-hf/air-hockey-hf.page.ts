import { Component } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { GameCardComponent, PanschWaitingComponent } from "@components";
import { BaseAirHockeyPage } from "@pages/disciplines/03-air-hockey/base-air-hockey.page";
import { firstValueFrom, Observable } from "rxjs";
import { Game } from "@interfaces";
import { PanschKey } from "@types";
import {
  IonButton,
  IonButtons, IonContent,
  IonHeader,
  IonIcon, IonList,
  IonMenuButton,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";


@Component({
  selector: 'lp-air-hockey-hf',
  templateUrl: './air-hockey-hf.page.html',
  styleUrls: ['./air-hockey-hf.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    GameCardComponent,
    PanschWaitingComponent,
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
  ],
})
export class AirHockeyHfPage extends BaseAirHockeyPage {
  public airHockeyHfGames$: Observable<Game[]> = this.airHockeyService.airHockeyHfGames$;
  public disableSave$: Observable<boolean> = this.airHockeyService.disableHfSave$;
  public calcStartedKey: PanschKey = "airHockeyHfCalculationStarted";

  public async calculateResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.airHockeyHfGames$);
    await this.airHockeyService.addAirHockeyScore(games);
    await this.latschiPanschService.updatePanschItem("airHockeyHfCalculationStarted");
    await this.airHockeyService.initNextRound("airHockeyFinalGames", games);
    await this.latschiPanschService.updatePanschItem("airHockeyHfCalculationFinished");
    void this.router.navigate(['/air-hockey/air-hockey-final']);
  }

  public async calculateFakeResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.airHockeyHfGames$);
    await this.airHockeyService.calculateFakeAirHockeyScore<"fakeAirHockeyHfCalculationStarted">(games, "fakeAirHockeyHfCalculationStarted");
  }
}
