import { Component, inject, Signal } from '@angular/core';
import { AlertController, CheckboxCustomEvent } from "@ionic/angular";
import { PlayerService } from "@services";
import { NgFor } from '@angular/common';
import { UserSelectionService } from "@pages/setup/user-selection/user-selection.service";
import { PossiblePlayer } from "@interfaces";
import {
  IonCheckbox,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
  IonListHeader
} from "@ionic/angular/standalone";

@Component({
    selector: 'lp-player-list',
    templateUrl: './player-list.component.html',
    styleUrls: ['./player-list.component.scss'],
    imports: [NgFor, IonList, IonListHeader, IonItemSliding, IonItem, IonCheckbox, IonItemOptions, IonItemOption]
})
export class PlayerListComponent {
  private alertController: AlertController = inject(AlertController);
  private userSelectionService: UserSelectionService = inject(UserSelectionService);
  private playerService: PlayerService = inject(PlayerService);
  public possiblePlayers$: Signal<PossiblePlayer[]> = this.playerService.possiblePlayers$;

  checkboxChanged(event: Event, possiblePlayer: PossiblePlayer) {
    const customEvent = event as CheckboxCustomEvent;
    possiblePlayer.selected = customEvent.detail.checked;
    this.userSelectionService.updatePossiblePlayer(possiblePlayer);
  }

  async deletePossiblePlayer(possiblePlayer: PossiblePlayer, slidingItem: IonItemSliding): Promise<void> {
    const alert = await this.alertController.create({
      message: `Möchtest du Spieler ${possiblePlayer.name} wirklich löschen?`,
      cssClass: 'custom-alert',
      buttons: [{
        text: 'Fick dich',
        role: 'cancel',
        cssClass: 'alert-button-cancel',
        handler: async () => await slidingItem.close()
      },
        {
          text: 'Weg mit ihm',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.userSelectionService.deletePossiblePlayer(possiblePlayer);
          },
        }]
    });
    await alert.present();
  }

}
