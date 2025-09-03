import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseDartPage } from "@pages/disciplines/05-dart/base-dart.page";
import { firstValueFrom, Observable } from "rxjs";

import { DartPlayerPipe } from '../dart-player-pipe/dart-player.pipe';
import { HeaderComponent, PanschWaitingComponent } from "@components";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
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
  IonNote,
  IonSelect,
  IonSelectOption,
} from "@ionic/angular/standalone";

@Component({
  selector: 'lp-dart-preliminary',
  templateUrl: './dart-preliminary.page.html',
  styleUrls: ['./dart-preliminary.page.scss'],
  imports: [
    HeaderComponent,
    NgIf,
    FormsModule,
    NgFor,
    PanschWaitingComponent,
    AsyncPipe,
    DartPlayerPipe,
    IonContent,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonNote,
    IonListHeader,
    IonFooter,
    IonButton,
    IonIcon,
  ],
})
export class DartPreliminaryPage extends BaseDartPage implements OnInit, OnDestroy {
  public preliminaryGames$: Observable<DartGame[]> = this.dartService.preliminaryGames$;
  public selectedDartGame$: Observable<Observable<DartGame | undefined>> = this.dartService.selectedPreliminaryGame$;
  public preliminaryRoundFinished$: Observable<boolean> = this.dartService.preliminaryRoundFinished$;

  public selectedValue = "";

  async ngOnInit() {
    const subscription = this.preliminaryGames$.subscribe(games => {
      if (games.length === 4) {
        this.selectedValue = games[0].id ?? "";
        void this.dartService.updateSelectedDartGame(this.selectedValue);
        subscription.unsubscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.selectedValue = "";
    this.dartService.resetSelectedGame();
  }

  async handleChange(event: Event) {
    const customEvent = event as CustomEvent;
    const selectedDartGameId = customEvent.detail.value;
    await this.dartService.updateSelectedDartGame(selectedDartGameId);
  }

  public async calculateFinalRound(): Promise<void> {
    await this.dartService.calculateFinalRound();
  }

  public async calculateFakeResult(): Promise<void> {
    const dartGame: DartGame | undefined = await (firstValueFrom(await firstValueFrom(this.selectedDartGame$)));
    if (dartGame) {
      await this.dartService.calculateFakeScore(dartGame);
    }
  }
}
