import { Component } from '@angular/core';
import { BaseTeamItemComponent } from "../base-team-item.abstract";
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'lp-single-team-item',
  templateUrl: './single-team-item.component.html',
  styleUrls: ['./single-team-item.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class SingleTeamItemComponent extends BaseTeamItemComponent {


}
