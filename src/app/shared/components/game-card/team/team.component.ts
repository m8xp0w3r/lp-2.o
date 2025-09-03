import { Component } from '@angular/core';
import { BaseTeamItemComponent } from "./base-team-item.abstract";
import { DoubleTeamItemComponent } from "./double-team-item/double-team-item.component";
import { SingleTeamItemComponent } from "./single-team-item/single-team-item.component";
import { NgIf } from "@angular/common";

@Component({
    selector: 'lp-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss'],
    imports: [
        DoubleTeamItemComponent,
        SingleTeamItemComponent,
        NgIf
    ]
})
export class TeamComponent extends BaseTeamItemComponent {

}
