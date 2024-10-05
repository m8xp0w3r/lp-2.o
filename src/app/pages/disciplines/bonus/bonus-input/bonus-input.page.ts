import { Component, inject, OnInit } from '@angular/core';
import { combineLatest, firstValueFrom, map, Observable, take } from "rxjs";

import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, LatschiPanschService } from "@services";
import { BonusService } from "@pages/disciplines/bonus/bonus.service";
import { AlertController } from "@ionic/angular";
import { BonusSortingOrder } from "@enums";
import { Player } from "@interfaces";
import { environment } from "@environments/environment";
import {
  IonButton,
  IonButtons, IonContent,
  IonHeader,
  IonIcon, IonItem, IonLabel, IonList,
  IonMenuButton, IonNote, IonSelect, IonSelectOption,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";

@Component({
    selector: 'lp-bonus-input',
    templateUrl: './bonus-input.page.html',
    styleUrls: ['./bonus-input.page.scss'],
    standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NgFor,
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
    IonItem,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonNote,
  ],
})
export class BonusInputPage implements OnInit {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  private bonusService: BonusService = inject(BonusService);
  private alertController: AlertController = inject(AlertController);
  private authService: AuthService = inject(AuthService);

  public readonly BonusSortingOrder = BonusSortingOrder;

  public sortingOrder$: Observable<BonusSortingOrder | undefined> = this.bonusService.selectedSortingOrder$;
  public players$: Observable<Player[]> = combineLatest([this.latschiPanschService.players$, this.sortingOrder$])
    .pipe(
      map(([players, sortingOrder]) => {
        if (sortingOrder === undefined) return players;
        players.sort(sortingOrder === BonusSortingOrder.descending ? this.bonusService.sortAscending : this.bonusService.sortDescending);
        return players;
      })
    );
  public currentUser$ = this.authService.currentUser$;
  public currentPansch$ = this.latschiPanschService.currentPansch$;
  public disableSave$: Observable<boolean> = combineLatest([this.players$, this.currentPansch$, this.sortingOrder$])
    .pipe(
      map(([players, pansch, sortingOrder]) => players
        .filter(player => player.bonusScore !== undefined).length < 16 || (pansch?.bonusCalculationStarted ?? false) || sortingOrder === undefined));
  public testMode = environment.testMode;
  public selectedSortingOrder: BonusSortingOrder | undefined;

  ngOnInit(): void {
    this.sortingOrder$
      .pipe(take(1))
      .subscribe(sortingOrder => this.selectedSortingOrder = sortingOrder);
  }

  async handleChange(event: Event) {
    const customEvent = event as CustomEvent;
    const selectedSortingOrder = customEvent.detail.value as BonusSortingOrder;
    this.bonusService.updateSelectedSortingOrder(selectedSortingOrder);
  }

  public async addScore(player: Player) {
    if (!await firstValueFrom(this.authService.currentUser$)) return;
    if (!(await firstValueFrom(this.latschiPanschService.currentPansch$))?.bonusCalculationStarted) {
      const alert = await this.alertController.create({
        cssClass: 'custom-alert',
        header: `Bitte Punkte für ${player.name} eingeben.`,
        inputs: [{
          name: "bonusScore",
          type: 'number',
          id: 'bonusInput',
          placeholder: 'Punkte',
          value: player.bonusScore ?? "",
        }],
        buttons: [{
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: async () => {
          }
        },
          {
            text: 'OK',
            role: 'confirm',
            cssClass: 'alert-button-confirm',
            handler: (data) => {
              if (!isNaN(data.bonusScore) && data.bonusScore !== "") {
                player.bonusScore = parseInt(data.bonusScore);
                this.bonusService.updatePlayer(player);
              }
            },
          }]
      });
      await alert.present();
      const inputField: HTMLElement = document.querySelector("#pinInput") as HTMLElement;
      if (inputField) {
        inputField.focus();
      }
    } else {
      const warnAlert = await this.alertController.create({
        header: "Bonusrunden-Berechnung abgeschlossen. Keine weiteren Änderungen möglich!",
        buttons: ['OK']
      });
      await warnAlert.present();
    }
  }

  public async calculateResult(): Promise<void> {
    if (this.players$) {
      await this.bonusService.calculateResult();
    }
  }

  public calculateFakeResult(): void {
    void this.bonusService.calculateFakeResult();
  }
}
