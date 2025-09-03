import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Team } from "@interfaces";

@Component({
    template: "",
    standalone: false
})
export abstract class BaseTeamItemComponent {
  @Input() team: Team | undefined;

  @Output() scoreUpdated: EventEmitter<Team> = new EventEmitter<Team>();

  public provideResult(): void {
    if (this.team) {
      this.scoreUpdated.emit(this.team);
    }
  }
}
