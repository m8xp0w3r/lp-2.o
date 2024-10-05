import { Component } from '@angular/core';
import { BaseDisciplineComponent } from "@pages/disciplines/base-discipline.component";
import { IonicModule } from '@ionic/angular';
import { LatschiPansch } from "@interfaces";

@Component({
    selector: 'lp-billard',
    templateUrl: './billiard.page.html',
    styleUrls: ['./billiard.page.scss'],
    standalone: true,
    imports: [IonicModule],
})
export class BilliardPage extends BaseDisciplineComponent {
  route = "/billiard/billiard-results";
  property = "billiardCalculationFinished" as keyof LatschiPansch;
}
