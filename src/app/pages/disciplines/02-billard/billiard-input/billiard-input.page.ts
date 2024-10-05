import { Component, inject } from "@angular/core";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { GameCardComponent, PanschWaitingComponent } from "@components";
import { BilliardService } from "@pages/disciplines/02-billard/billiard.service";
import { AuthService, LatschiPanschService } from "@services";
import { firstValueFrom, Observable } from "rxjs";
import { Game } from "@interfaces";
import { environment } from "@environments/environment";
import { PanschKey } from "@types";
import {
  IonButton,
  IonButtons, IonContent,
  IonHeader,
  IonIcon, IonList,
  IonMenuButton,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";


@Component({
    selector: 'lp-billiard-input',
    templateUrl: './billiard-input.page.html',
    styleUrls: ['./billiard-input.page.scss'],
    standalone: true,
  imports: [
    NgIf,
    NgFor,
    GameCardComponent,
    PanschWaitingComponent,
    AsyncPipe,
    IonHeader,
    IonButtons,
    IonMenuButton,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
  ],
})
export class BilliardInputPage {
  private billiardService: BilliardService = inject(BilliardService);
  private authService: AuthService = inject(AuthService);
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);

  public billiardGames$: Observable<Game[]> = this.billiardService.billiardGames$;
  public disableSave$: Observable<boolean> = this.billiardService.disableSave$;
  public currentUser$ = this.authService.currentUser$;
  public testMode = environment.testMode;
  public currentPansch$ = this.latschiPanschService.currentPansch$;
  public calcStartedKey: PanschKey = "billiardCalculationStarted";

  public async calculateResult(): Promise<void> {
    const games = await firstValueFrom(this.billiardGames$);
    await this.billiardService.setBilliardResult(games);
    await this.billiardService.calculateResult();
  }

  public calculateFakeResult(): void {
    void this.billiardService.calculateFakeResult();
  }
}
