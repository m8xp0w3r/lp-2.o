import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserSelectionService } from "src/app/pages/setup/user-selection/user-selection.service";
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'lp-add-player-input',
    templateUrl: './add-player-input.component.html',
    styleUrls: ['./add-player-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FormsModule, IonicModule]
})
export class AddPlayerInputComponent {
    private userSelectionService: UserSelectionService = inject(UserSelectionService);
    public newPlayer = "";

    async addPossiblePlayer(): Promise<void> {
        await this.userSelectionService.addPossiblePlayer(this.newPlayer);
        this.newPlayer = "";
    }
}
