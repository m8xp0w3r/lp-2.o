import { Component, OnInit } from '@angular/core';
import { BaseDisciplineComponent } from "@pages/disciplines/base-discipline.component";
import { takeUntil } from "rxjs";
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from "@ionic/angular/standalone";
import { LatschiPansch } from "@interfaces";

@Component({
  selector: 'lp-dart',
  templateUrl: './dart.page.html',
  styleUrls: ['./dart.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class DartPage extends BaseDisciplineComponent implements OnInit {
  route = "/dart/dart-result";
  property = "dartCalculationFinished" as keyof LatschiPansch;

  ngOnInit() {
    this.latschiPanschService.currentPansch$
    .pipe(takeUntil(this.subscriptionSubject$))
    .subscribe(currentPansch => {
      if (currentPansch && currentPansch.dartPreliminaryRoundCalculated && !currentPansch[this.property]) {
        void this.router.navigate(["/dart/dart-final"]);
      }
    });
  }
}
