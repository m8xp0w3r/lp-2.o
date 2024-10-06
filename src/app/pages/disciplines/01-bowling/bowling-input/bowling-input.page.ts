import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonNote,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { AuthService, LatschiPanschService } from "@services";
import { AlertController } from "@ionic/angular";
import { combineLatest, firstValueFrom, map, Observable } from "rxjs";
import { Player } from "@interfaces";
import { BowlingService } from "@pages/disciplines/01-bowling/bowling.service";
import { environment } from "@environments/environment";
import { PanschWaitingComponent } from "@components";

@Component({
  selector: 'lp-bowling-input',
  templateUrl: './bowling-input.page.html',
  styleUrls: ['./bowling-input.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonButton, IonIcon, IonList, IonItem, IonNote, IonLabel, PanschWaitingComponent]
})
export class BowlingInputPage {

  public testMode = environment.testMode;
  private bowlingService: BowlingService = inject(BowlingService);
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  public players$: Observable<Player[]> = this.latschiPanschService.players$;
  public currentPansch$ = this.latschiPanschService.currentPansch$;
  private alertController: AlertController = inject(AlertController);
  private authService: AuthService = inject(AuthService);
  public currentUser$ = this.authService.currentUser$;
  public disableSave$: Observable<boolean> = combineLatest([this.players$, this.currentPansch$])
    .pipe(
      map(([players, pansch]) => players
        .filter(player => player.bowlingPins !== undefined).length < 16 || (pansch?.bowlingCalculationStarted ?? false)));

  public async addPins(player: Player) {
    if (!await firstValueFrom(this.authService.currentUser$)) return;
    if (!(await firstValueFrom(this.latschiPanschService.currentPansch$))?.bowlingCalculationStarted) {
      const alert = await this.alertController.create({
        cssClass: 'custom-alert',
        header: `Bitte Anzahl der Pins für ${player.name} eingeben`,
        inputs: [{
          name: "pins",
          type: 'number',
          id: 'pinInput',
          placeholder: 'Pins',
          value: player.bowlingPins ?? "",
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
              if (!isNaN(data.pins) && data.pins !== "") {
                player.bowlingPins = parseInt(data.pins);
                this.bowlingService.updatePlayer(player);
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
        header: "Bowling Berechnung abgeschlossen. Keine weiteren Änderungen möglich!",
        buttons: ['OK']
      });
      await warnAlert.present();
    }
  }

  public async calculateResult(): Promise<void> {
    if (this.players$) {
      await this.bowlingService.calculateResult();
    }
  }

  public async calculateFakeResult(): Promise<void> {
    await this.bowlingService.calculateFakeResult();
  }

}
