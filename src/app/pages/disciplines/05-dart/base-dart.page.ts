import { Component, inject } from "@angular/core";
import { environment } from "@environments/environment";
import { DartService } from "@pages/disciplines/05-dart/dart.service";
import { AuthService, GameService, LatschiPanschService } from "@services";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { DartGame, DartPlayer, LatschiPansch } from "@interfaces";
import { firstValueFrom } from "rxjs";

@Component({
    template: ``,
    selector: "lp-base-dart",
    standalone: false
})
export abstract class BaseDartPage {
  public testMode = environment.testMode;
  protected dartService: DartService = inject(DartService);
  protected authService: AuthService = inject(AuthService);
  public currentUser$ = this.authService.currentUser$;
  protected latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  public currentPansch$ = this.latschiPanschService.currentPansch$;
  protected router: Router = inject(Router);
  protected alertController: AlertController = inject(AlertController);
  protected gameService: GameService = inject(GameService);

  public async updateScore(player: DartPlayer, dartGame: DartGame) {
    if (!await firstValueFrom(this.authService.currentUser$)) return;
    const currentPansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (currentPansch && !dartGame.calculationFinished) {
      const alert = await this.alertController.create({
        cssClass: 'custom-alert',
        header: `Bitte Score für ${player.name} eingeben`,
        inputs: [{
          name: "score",
          type: 'number',
          id: 'scoreInput',
          placeholder: 'Score',
          value: player.score ?? "",
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
              if (!isNaN(data.score) && data.score !== "") {
                player.score = parseInt(data.score);
                this.gameService.updateGame<DartGame>(dartGame);
              }
            },
          }]
      });
      await alert.present();
      const inputField: HTMLElement = document.querySelector("#scoreInput") as HTMLElement;
      if (inputField) {
        inputField.focus();
      }
    } else {
      const warnAlert = await this.alertController.create({
        header: "Berechnung abgeschlossen. Keine weiteren Änderungen möglich!",
        buttons: ['OK']
      });
      await warnAlert.present();
    }
  }

  public async selectWinner(dartPlayer: DartPlayer, selectedGame: DartGame) {
    if (!await firstValueFrom(this.authService.currentUser$)) return;
    const currentPansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (currentPansch && !selectedGame.calculationFinished) {
      const alert = await this.alertController.create({
        header: 'Bestätigung',
        cssClass: 'custom-alert',
        message: `${dartPlayer.name} als Sieger auswählen?`,
        buttons: [
          {
            text: 'No',
            cssClass: 'alert-button-cancel',
          },
          {
            text: 'Yes',
            cssClass: 'alert-button-confirm',
            handler: () => {
              selectedGame.winner = dartPlayer;
              selectedGame.calculationFinished = true;
              this.gameService.updateGame<DartGame>(selectedGame);
            }
          }
        ],
      });
      await alert.present();
    }
  }
}
