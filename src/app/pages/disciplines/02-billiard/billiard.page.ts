import { Component } from '@angular/core';
import { BaseDisciplineComponent } from "@pages/disciplines/base-discipline.component";
import { LatschiPansch } from "@interfaces";
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from "@ionic/angular/standalone";

@Component({
  selector: 'lp-billard',
  templateUrl: './billiard.page.html',
  styleUrls: ['./billiard.page.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  ],
})
export class BilliardPage extends BaseDisciplineComponent {
  route = "/billiard/billiard-results";
  property = "billiardCalculationFinished" as keyof LatschiPansch;
}
