import { Component } from '@angular/core';
import { BaseTeamItemComponent } from "./base-team-item.abstract";

@Component({
  selector: 'lp-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  standalone: true,
})
export class TeamComponent extends BaseTeamItemComponent {

}
