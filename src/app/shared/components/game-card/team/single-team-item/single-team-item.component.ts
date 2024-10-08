import { Component } from '@angular/core';
import { BaseTeamItemComponent } from "../base-team-item.abstract";
import { NgIf } from "@angular/common";
import { IonItem, IonLabel, IonNote } from "@ionic/angular/standalone";

@Component({
  selector: 'lp-single-team-item',
  templateUrl: './single-team-item.component.html',
  styleUrls: ['./single-team-item.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    IonItem,
    IonLabel,
    IonNote
  ]
})
export class SingleTeamItemComponent extends BaseTeamItemComponent {


}
