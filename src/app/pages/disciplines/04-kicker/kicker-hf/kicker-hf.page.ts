import { Component } from '@angular/core';
import { BaseKickerPage } from "@pages/disciplines/04-kicker/base-kicker.page";
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
  selector: 'lp-kicker-hf',
  templateUrl: './kicker-hf.page.html',
  styleUrls: ['./kicker-hf.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    NgFor,
    GameCardComponent,
    PanschWaitingComponent,
    AsyncPipe,
  ],
})
export class KickerHfPage extends BaseKickerPage {
  public kickerHfGames$: Observable<Game[]> = this.kickerService.kickerHfGames$;
  public disableSave$: Observable<boolean> = this.kickerService.disableHfSave$;
  public calcStartedKey: PanschKey = "kickerHfCalculationStarted";

  public async calculateResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.kickerHfGames$);
    await this.kickerService.addKickerScore(games);
    await this.latschiPanschService.updatePanschItem("kickerHfCalculationStarted");
    await this.kickerService.initNextRound("kickerFinalGames", games);
    await this.latschiPanschService.updatePanschItem("kickerHfCalculationFinished");
    void this.router.navigate(['/kicker/kicker-final']);
  }

  public async calculateFakeResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.kickerHfGames$);
    await this.kickerService.calculateFakeKickerScore<"fakeKickerHfCalculationStarted">(games, "fakeKickerHfCalculationStarted");
  }
}
