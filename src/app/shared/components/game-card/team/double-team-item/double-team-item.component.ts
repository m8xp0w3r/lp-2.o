import { Component } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { BaseTeamItemComponent } from "../base-team-item.abstract";

@Component({
  selector: 'lp-double-team-item',
  templateUrl: './double-team-item.component.html',
  styleUrls: ['./double-team-item.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class DoubleTeamItemComponent extends BaseTeamItemComponent {
  public changeResult(): void {

  }
}

