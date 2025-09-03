import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ViewDidLeave, ViewWillEnter } from '@ionic/angular/standalone';
import { firstValueFrom, Subject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { LatschiPanschService } from "@services";
import { HeaderComponent } from "@components";
import { AddPlayerInputComponent } from "@pages/setup/user-selection/add-player-input/add-player-input.component";
import { PlayerListComponent } from "@pages/setup/user-selection/player-list/player-list.component";
import {
  UserSelectionFooterComponent
} from "@pages/setup/user-selection/user-selection-footer/user-selection-footer.component";


@Component({
    selector: 'lp-user-selection',
    templateUrl: './user-selection.page.html',
    styleUrls: ['./user-selection.page.scss'],
    imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HeaderComponent, AddPlayerInputComponent, PlayerListComponent, UserSelectionFooterComponent]
})
export class UserSelectionPage implements ViewWillEnter, ViewDidLeave {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  private subscriptionSubject: Subject<void> = new Subject<void>();
  private router: Router = inject(Router);

  async ionViewDidLeave(): Promise<void> {
    console.log("destroy user selection page");
    this.subscriptionSubject.next();
    this.subscriptionSubject.complete();
  }

  async ionViewWillEnter(): Promise<void> {
    const currentPansch = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (currentPansch) {
      this.latschiPanschService.players$
        .pipe(takeUntil(this.subscriptionSubject))
        .subscribe(players => {
          console.log("players");
          if (players.length === 16) {
            console.log("nav home");
            this.router.navigate(["/home"]);
          }
        });
    }

  }

}
