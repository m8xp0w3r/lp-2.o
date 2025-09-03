import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { LatschiPanschService } from "@services";
import { PanschKey } from "@types";
import { ViewDidLeave } from "@ionic/angular/standalone";

@Component({
  template: "",
  standalone: false,
})
export abstract class BaseDisciplineComponent implements ViewDidLeave {
  protected latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  protected router: Router = inject(Router);
  protected subscriptionSubject$: Subject<void> = new Subject<void>();

  abstract route: string;
  abstract property: PanschKey;

  constructor() {
    this.latschiPanschService.currentPansch$
    .pipe(takeUntil(this.subscriptionSubject$))
    .subscribe(currentPansch => {
      console.log("cp: ", currentPansch);
      console.log("prop: ", this.property);
      if (currentPansch && currentPansch[this.property]) {
        console.log("navigate to: ", this.property);
        void this.router.navigate([this.route]);
      }
    });
  }

  ionViewDidLeave(): void {
    this.subscriptionSubject$.next();
    this.subscriptionSubject$.complete();
  }
}
