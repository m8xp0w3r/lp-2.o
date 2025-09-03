import { Component, OnInit } from '@angular/core';
import { BaseDisciplineComponent } from "@pages/disciplines/base-discipline.component";
import { take } from "rxjs";
import { LatschiPansch } from "@interfaces";
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from "@ionic/angular/standalone";

@Component({
    selector: 'lp-kicker',
    templateUrl: './kicker.page.html',
    styleUrls: ['./kicker.page.scss'],
    imports: [
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonLabel
    ]
})
export class KickerPage extends BaseDisciplineComponent implements OnInit {
  route = "/kicker/kicker-result";
  property = "kickerCalculationFinished" as keyof LatschiPansch;

  public ngOnInit() {
    this.latschiPanschService.currentPansch$
      .pipe(take(1))
      .subscribe(currentPansch => {
        if (!currentPansch) return;
        if (currentPansch.kickerHfCalculationFinished) {
          void this.router.navigate(["/kicker/kicker-final"]);
          return;
        }
        if (currentPansch.kickerVfCalculationFinished) {
          void this.router.navigate(["/kicker/kicker-hf"]);
          return;
        }
      });
  }
}
