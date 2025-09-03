import { Component } from '@angular/core';
import { BaseTeamItemComponent } from "../base-team-item.abstract";
import { NgIf } from "@angular/common";
import { IonCol, IonItem, IonLabel, IonNote, IonRow } from "@ionic/angular/standalone";

@Component({
    selector: 'lp-double-team-item',
    templateUrl: './double-team-item.component.html',
    styleUrls: ['./double-team-item.component.scss'],
    imports: [
        NgIf,
        IonItem,
        IonRow,
        IonCol,
        IonLabel,
        IonNote
    ]
})
export class DoubleTeamItemComponent extends BaseTeamItemComponent {
  public changeResult(): void {

  }
}

