import { Component, inject } from '@angular/core';

import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { HeaderComponent } from "@components";
import { LatschiPanschService } from "@services";
import { Observable } from "rxjs";
import { LatschiPansch } from "@interfaces";
import { DatetimeCustomEvent, ToggleCustomEvent } from "@ionic/angular";
import {
  IonCheckbox,
  IonContent,
  IonDatetime,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonNote,
  IonToggle,
} from "@ionic/angular/standalone";
import { Timestamp } from "@angular/fire/firestore";

@Component({
  selector: 'lp-pansch-administration',
  templateUrl: './pansch-administration.page.html',
  styleUrls: ['./pansch-administration.page.scss'],
  imports: [
    HeaderComponent,
    NgIf,
    AsyncPipe,
    DatePipe,
    IonContent,
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonCheckbox,
    IonToggle,
    IonNote,
    IonModal,
    IonDatetime,
  ],
})
export class PanschAdministrationPage {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  public currentPansch$: Observable<LatschiPansch | undefined> = this.latschiPanschService.currentPansch$;

  public releasePansch(event: Event): void {
    const releasePanschEvent = event as ToggleCustomEvent;
    void this.latschiPanschService.releasePansch(releasePanschEvent.detail.checked);
  }

  public updatePanschDate(event: Event, modal: IonModal): void {
    const dateChangeEvent = event as DatetimeCustomEvent;
    const newDate: string | string[] | null | undefined = dateChangeEvent.detail.value;
    if (typeof newDate === "string") {
      void this.latschiPanschService.updatePanschDate(Timestamp.fromDate(new Date(newDate)));
    }
    void modal.dismiss();
  }

}
