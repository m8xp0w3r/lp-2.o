import { Component, inject } from "@angular/core";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { GameCardComponent, PanschWaitingComponent } from "@components";
import { AuthService, LatschiPanschService } from "@services";
import { firstValueFrom, Observable } from "rxjs";
import { Game } from "@interfaces";
import { environment } from "@environments/environment";
import { PanschKey } from "@types";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonMenuButton,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import { BilliardService } from "@pages/disciplines/02-billiard/billiard.service";


@Component({
    selector: 'lp-billiard-input',
    templateUrl: './billiard-input.page.html',
    styleUrls: ['./billiard-input.page.scss'],
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
    ]
})
export class BilliardInputPage {
  public testMode = environment.testMode;
  public calcStartedKey: PanschKey = "billiardCalculationStarted";
  private billiardService: BilliardService = inject(BilliardService);
  public billiardGames$: Observable<Game[]> = this.billiardService.billiardGames$;
  public disableSave$: Observable<boolean> = this.billiardService.disableSave$;
  private authService: AuthService = inject(AuthService);
  public currentUser$ = this.authService.currentUser$;
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  public currentPansch$ = this.latschiPanschService.currentPansch$;

  public async calculateResult(): Promise<void> {
    const games = await firstValueFrom(this.billiardGames$);
    await this.billiardService.setBilliardResult(games);
    await this.billiardService.calculateResult();
  }

  public calculateFakeResult(): void {
    void this.billiardService.calculateFakeResult();
  }
}
