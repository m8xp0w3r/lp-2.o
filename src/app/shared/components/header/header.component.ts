import { Component, inject, Input } from '@angular/core';
import { AlertController, IonicModule } from "@ionic/angular";
import { AuthService, LatschiPanschService } from "@services";
import { Observable } from "rxjs";
import { User } from "@angular/fire/auth";

@Component({
  selector: 'lp-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class HeaderComponent {
  private alertController: AlertController = inject(AlertController);
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  private authService: AuthService = inject(AuthService);
  public currentUser$: Observable<User | null> = this.authService.currentUser$;
  @Input() title = "";
  @Input() showAddPanschButtons = false;

  async createPansch(): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert',
      header: `Neuen Pansch erstellen`,
      message: "Bitte die aktuelle Pansch Nummer eingeben.",
      inputs: [{
        name: "edition",
        type: 'number',
        id: 'addPansch',
        placeholder: 'Volume',
        value: "",
        attributes: {
          autofocus: true
        }
      }],
      buttons: [{
        text: 'Abbrechen',
        role: 'cancel',
        cssClass: 'alert-button-cancel',
        handler: async () => {
        }
      },
        {
          text: 'OK',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: (data) => {
            if (!isNaN(data.edition) && data.edition !== "") {
              const edition = parseInt(data.edition);
              this.latschiPanschService.createPansch(edition);
            }
          },
        }]
    });
    await alert.present();
    const inputField: HTMLElement = document.querySelector("#addPansch") as HTMLElement;
    if (inputField) {
      inputField.focus();
    }
  }

}
