import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { LatschiPanschService } from "../../../../shared/services/latschi-pansch.service";
import { PossiblePlayer } from "src/app/models/possible-player.model";
import { PlayerService } from "../../../../shared/services/player.service";
import { LatschiPansch } from "@models/latschi-pansch.interface";
import { firstValueFrom } from "rxjs";
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';

@Component({
    selector: 'lp-user-selection-footer',
    templateUrl: './user-selection-footer.component.html',
    styleUrls: ['./user-selection-footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [IonicModule, NgIf]
})
export class UserSelectionFooterComponent {
    private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
    private playerService: PlayerService = inject(PlayerService);
    public selectedPlayers$: Signal<PossiblePlayer[]> = this.playerService.selectedPlayers$;

    async setPlayer(players: PossiblePlayer[]): Promise<void> {
        const currentLatschiPansch: LatschiPansch | undefined = await firstValueFrom(this.latschiPanschService.currentPansch$);
        if (currentLatschiPansch) {
            void this.playerService.setPlayer(currentLatschiPansch, players);
            void this.latschiPanschService.initializeGame(true);
        }
    }
}
