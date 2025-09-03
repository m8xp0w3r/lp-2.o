import { ChangeDetectionStrategy, Component, inject, WritableSignal } from "@angular/core";
import { HeaderComponent } from "@components";
import { IonButton, IonContent, IonIcon, IonImg, IonItem, IonLabel, IonList, IonNote, ModalController } from "@ionic/angular/standalone";
import { AsyncPipe, DatePipe, NgFor, NgIf } from "@angular/common";
import { AuthService, LatschiPanschService, PlayerService } from "@services";
import { Router } from "@angular/router";
import { LatschiPansch } from "@interfaces";
import { firstValueFrom, Observable } from "rxjs";
import { User } from "@angular/fire/auth";
import { environment } from "@environments/environment";
import { PanschSelectionLegendComponent } from "@pages/setup/pansch-selection/pansch-selection-legend/pansch-selection-legend.component";
import { PanschCountdownComponent } from "@pages/setup/pansch-selection/pansch-countdown/pansch-countdown.component";

@Component({
  selector: 'lp-pansch-selection',
  templateUrl: './pansch-selection.page.html',
  styleUrls: ['./pansch-selection.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    NgIf, NgFor,
    AsyncPipe, DatePipe, PanschCountdownComponent, IonContent, IonButton, IonIcon, IonList, IonItem, IonLabel, IonNote, IonImg,
  ],
})
export class PanschSelectionPage {
  public devMode = environment.localDevMode;
  private modalCtrl: ModalController = inject(ModalController);
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  public latschiPanschCollection$: WritableSignal<LatschiPansch[]> = this.latschiPanschService.latschiPanschCollection$;
  private playerService: PlayerService = inject(PlayerService);
  private authService: AuthService = inject(AuthService);
  public currentUser$: Observable<User | null> = this.authService.currentUser$;
  private router: Router = inject(Router);

  async panschSelected(latschiPansch: LatschiPansch): Promise<void> {
    if (latschiPansch && latschiPansch.id) {
      await this.latschiPanschService.setPansch(latschiPansch);
      if (await firstValueFrom(this.authService.currentUser$)) {
        const players = await this.playerService.getPlayerSnapshot(latschiPansch);
        if (!players || players.length !== 16) {
          void this.router.navigate([`/user-selection`]);
        } else {
          await this.latschiPanschService.initializeGame(true);
        }
      } else {
        void this.router.navigate(['/home']);
      }
    }
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: PanschSelectionLegendComponent,
    });
    void modal.present();
  }

}
