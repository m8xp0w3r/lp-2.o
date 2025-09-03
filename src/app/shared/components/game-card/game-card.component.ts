import { Component, inject, Input } from '@angular/core';
import { AuthService, GameService, LatschiPanschService } from "@services";
import { AlertController } from "@ionic/angular";
import { Game, Team } from "@interfaces";
import { PanschKey } from "@types";
import { firstValueFrom } from "rxjs";
import { IonCard, IonCardHeader, IonCol, IonGrid, IonRow } from "@ionic/angular/standalone";
import { TeamComponent } from "./team/team.component";
import { NgIf } from "@angular/common";

@Component({
  selector: 'lp-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonGrid,
    IonRow,
    TeamComponent,
    IonCol,
    NgIf,
  ],
})
export class GameCardComponent {
  @Input() game: Game | undefined;
  @Input() calcStartedKey: PanschKey | undefined;
  @Input() customTitle: string | undefined;
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  private authService: AuthService = inject(AuthService);
  private alertController: AlertController = inject(AlertController);
  private gameService: GameService = inject(GameService);

  constructor() {
  }

  public async updateScore(team: Team) {
    if (!await firstValueFrom(this.authService.currentUser$)) return;
    const currentPansch = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (currentPansch && this.calcStartedKey && !currentPansch[this.calcStartedKey]) {
      const alert = await this.alertController.create({
        cssClass: 'custom-alert',
        header: `Bitte Score für ${team.player1.name}${team.player2?.name ? ' und ' + team.player2?.name : ''} eingeben`,
        inputs: [{
          name: "score",
          type: 'number',
          id: 'scoreInput',
          placeholder: 'Score',
          value: team.score ?? "",
        }],
        buttons: [{
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          handler: async () => {
          },
        },
          {
            text: 'OK',
            role: 'confirm',
            cssClass: 'alert-button-confirm',
            handler: (data) => {
              if (!isNaN(data.score) && data.score !== "") {
                team.score = parseInt(data.score);
                if (this.game) {
                  this.gameService.updateGame<Game>(this.game);
                }
              }
            },
          }],
      });
      await alert.present();
      const inputField: HTMLElement = document.querySelector("#scoreInput") as HTMLElement;
      if (inputField) {
        inputField.focus();
      }
    } else {
      const warnAlert = await this.alertController.create({
        header: "Berechnung abgeschlossen. Keine weiteren Änderungen möglich!",
        buttons: ['OK'],
      });
      await warnAlert.present();
    }
  }
}
