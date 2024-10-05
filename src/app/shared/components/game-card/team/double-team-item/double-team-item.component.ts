import { Component } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { BaseTeamItemComponent } from "../base-team-item.abstract";
import { NgIf } from "@angular/common";

@Component({
  selector: 'lp-double-team-item',
  templateUrl: './double-team-item.component.html',
  styleUrls: ['./double-team-item.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf
  ]
})
export class DoubleTeamItemComponent extends BaseTeamItemComponent {
  public changeResult(): void {

  }
}

