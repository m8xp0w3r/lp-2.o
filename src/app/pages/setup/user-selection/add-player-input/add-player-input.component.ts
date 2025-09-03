import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserSelectionService } from "src/app/pages/setup/user-selection/user-selection.service";
import { FormsModule } from '@angular/forms';
import { IonButton, IonCol, IonGrid, IonIcon, IonInput, IonRow } from "@ionic/angular/standalone";

@Component({
  selector: 'lp-add-player-input',
  templateUrl: './add-player-input.component.html',
  styleUrls: ['./add-player-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonButton,
    IonIcon,
  ],
})
export class AddPlayerInputComponent {
  public newPlayer = "";
  private userSelectionService: UserSelectionService = inject(UserSelectionService);

  async addPossiblePlayer(): Promise<void> {
    await this.userSelectionService.addPossiblePlayer(this.newPlayer);
    this.newPlayer = "";
  }
}
