import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { LatschiPanschService, PlayerService } from "@services";
import { firstValueFrom } from "rxjs";
import { NgIf } from '@angular/common';
import { LatschiPansch, PossiblePlayer } from "@interfaces";
import { IonButton, IonButtons, IonFooter, IonTitle, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'lp-user-selection-footer',
  templateUrl: './user-selection-footer.component.html',
  styleUrls: ['./user-selection-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    IonFooter,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton
  ]
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
