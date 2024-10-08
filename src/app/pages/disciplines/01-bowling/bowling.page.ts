import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { LatschiPansch } from "@interfaces";
import { BaseDisciplineComponent } from "@pages/disciplines/base-discipline.component";

@Component({
  selector: 'lp-bowling',
  templateUrl: './bowling.page.html',
  styleUrls: ['./bowling.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class BowlingPage extends BaseDisciplineComponent {
  route = "/bowling/bowling-results";
  property = "bowlingCalculationFinished" as keyof LatschiPansch;

}
