import { Component } from "@angular/core";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { GameCardComponent, PanschWaitingComponent } from "@components";
import { BaseAirHockeyPage } from "@pages/disciplines/03-air-hockey/base-air-hockey.page";
import { firstValueFrom, Observable } from "rxjs";
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
  selector: 'lp-air-hockey-af',
  templateUrl: './air-hockey-af.page.html',
  styleUrls: ['./air-hockey-af.page.scss'],
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
export class AirHockeyAfPage extends BaseAirHockeyPage {
  public airHockeyAfGames$: Observable<Game[]> = this.airHockeyService.airHockeyAfGames$;
  public disableSave$: Observable<boolean> = this.airHockeyService.disableAfSave$;
  public calcStartedKey: PanschKey = "airHockeyAfCalculationStarted";

  public async calculateResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.airHockeyAfGames$);
    await this.airHockeyService.addAirHockeyScore(games);
    await this.latschiPanschService.updatePanschItem("airHockeyAfCalculationStarted");
    await this.airHockeyService.initNextRound("airHockeyVfGames", games);
    await this.latschiPanschService.updatePanschItem("airHockeyAfCalculationFinished");
    void this.router.navigate(['/air-hockey/air-hockey-vf']);
  }

  public async calculateFakeResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.airHockeyAfGames$);
    await this.airHockeyService.calculateFakeAirHockeyScore<"fakeAirHockeyAfCalculationStarted">(games, "fakeAirHockeyAfCalculationStarted");
  }
}
