import { Component } from '@angular/core';
import { BaseDisciplineComponent } from "@pages/disciplines/base-discipline.component";
import { IonContent, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from "@ionic/angular/standalone";
import { LatschiPansch } from "@interfaces";

@Component({
  selector: 'lp-bonus',
  templateUrl: './bonus.page.html',
  styleUrls: ['./bonus.page.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  ],
})
export class BonusPage extends BaseDisciplineComponent {
  route = "/bonus/bonus-results";
  property = "bonusCalculationFinished" as keyof LatschiPansch;
}
