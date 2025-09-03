import { Component } from '@angular/core';
import { BaseDisciplineComponent } from "@pages/disciplines/base-discipline.component";
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from "@ionic/angular/standalone";
import { LatschiPansch } from "@interfaces";

@Component({
    selector: 'lp-air-hockey',
    templateUrl: './air-hockey.page.html',
    styleUrls: ['./air-hockey.page.scss'],
    imports: [
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonLabel
    ]
})
export class AirHockeyPage extends BaseDisciplineComponent {
  route = "/air-hockey/air-hockey-result";
  property = "airHockeyCalculationFinished" as keyof LatschiPansch;
}
