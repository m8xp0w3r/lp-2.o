import { Component } from '@angular/core';
import { firstValueFrom, Observable } from "rxjs";

import { BaseKickerPage } from "@pages/disciplines/04-kicker/base-kicker.page";
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { GameCardComponent, PanschWaitingComponent } from "@components";
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
    selector: 'lp-kicker-final',
    templateUrl: './kicker-final.page.html',
    styleUrls: ['./kicker-final.page.scss'],
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
    IonList
  ],
})
export class KickerFinalPage extends BaseKickerPage {
  public kickerFinalGames$: Observable<Game[]> = this.kickerService.kickerFinalGames$;
  public kickerFinalGame$: Observable<Game[]> = this.kickerService.kickerFinalGame$;
  public disableSave$: Observable<boolean> = this.kickerService.disableFinalSave$;
  public disableFinalSave$: Observable<boolean> = this.kickerService.disableSave$;
  public calcStartedKey: PanschKey = "kickerFinalCalculationStarted";
  public calcFinalStartedKey: PanschKey = "kickerCalculationStarted";

  public async calculateFinalResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.kickerFinalGames$);
    await this.kickerService.addKickerScore(games);
    await this.latschiPanschService.updatePanschItem("kickerFinalCalculationStarted");
    await this.kickerService.initFinalGame(games);
    await this.latschiPanschService.updatePanschItem("kickerFinalCalculationFinished");
  }

  public async calculateResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.kickerFinalGame$);
    await this.kickerService.addKickerScore(games);
    await this.kickerService.calculateResult();
  }

  public async calculateFakeResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.kickerFinalGames$);
    await this.kickerService.calculateFakeKickerScore<"fakeKickerFinalCalculationStarted">(games, "fakeKickerFinalCalculationStarted");
  }

  public async calculateFinalFakeResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.kickerFinalGame$);
    await this.kickerService.calculateFakeKickerScore<"fakeKickerFinalGameCalculationStarted">(games, "fakeKickerFinalGameCalculationStarted");
  }
}
