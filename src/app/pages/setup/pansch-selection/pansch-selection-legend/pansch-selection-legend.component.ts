import { Component, inject } from '@angular/core';
import { ModalController } from "@ionic/angular";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";

@Component({
  selector: 'lp-pansch-selection-legend',
  templateUrl: './pansch-selection-legend.component.html',
  styleUrls: ['./pansch-selection-legend.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel

  ],
})
export class PanschSelectionLegendComponent {
  private modalCtrl: ModalController = inject(ModalController);

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
