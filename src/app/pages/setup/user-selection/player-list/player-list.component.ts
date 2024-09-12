import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { UserSelectionService } from "src/app/pages/setup/user-selection/user-selection.service";
import { PossiblePlayer } from "src/app/models/possible-player.model";
import { AlertController, CheckboxCustomEvent, IonItemSliding, IonicModule } from "@ionic/angular";
import { PlayerService } from "../../../../shared/services/player.service";
import { NgFor } from '@angular/common';

@Component({
    selector: 'lp-player-list',
    templateUrl: './player-list.component.html',
    styleUrls: ['./player-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [IonicModule, NgFor]
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
            message: `Möchtest du Spieler ${ possiblePlayer.name } wirklich löschen?`,
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
