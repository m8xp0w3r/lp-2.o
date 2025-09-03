import { Component } from '@angular/core';
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
  IonToolbar,
} from "@ionic/angular/standalone";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { GameCardComponent, PanschWaitingComponent } from "@components";
import { BaseKickerPage } from "@pages/disciplines/04-kicker/base-kicker.page";
import { Game } from "@interfaces";
import { PanschKey } from "@types";

@Component({
  selector: 'lp-kicker-vf',
  templateUrl: './kicker-vf.page.html',
  styleUrls: ['./kicker-vf.page.scss'],
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
export class KickerVfPage extends BaseKickerPage {
  public kickerVfGames$: Observable<Game[]> = this.kickerService.kickerVfGames$;
  public disableSave$: Observable<boolean> = this.kickerService.disableVfSave$;
  public calcStartedKey: PanschKey = "kickerVfCalculationStarted";

  public async calculateResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.kickerVfGames$);
    await this.kickerService.addKickerScore(games);
    await this.latschiPanschService.updatePanschItem("kickerVfCalculationStarted");
    await this.kickerService.initNextRound("kickerHfGames", games);
    await this.latschiPanschService.updatePanschItem("kickerVfCalculationFinished");
    void this.router.navigate(['/kicker/kicker-hf']);
  }

  public async calculateFakeResult(): Promise<void> {
    const games: Game[] = await firstValueFrom(this.kickerVfGames$);
    await this.kickerService.calculateFakeKickerScore<"fakeKickerVfCalculationStarted">(games, "fakeKickerVfCalculationStarted");
  }

}
