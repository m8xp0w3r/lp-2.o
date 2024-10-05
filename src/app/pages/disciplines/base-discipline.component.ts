import { Component, inject, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { LatschiPanschService } from "@services";
import { PanschKey } from "@types";


@Component({
  template: ""
})
export abstract class BaseDisciplineComponent implements OnDestroy {
  protected latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  protected router: Router = inject(Router);
  protected subscriptionSubject$: Subject<void> = new Subject<void>();

  abstract route: string;
  abstract property: PanschKey;

  constructor() {
    this.latschiPanschService.currentPansch$
      .pipe(takeUntil(this.subscriptionSubject$))
      .subscribe(currentPansch => {
        if (currentPansch && currentPansch[this.property]) {
          void this.router.navigate([this.route]);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscriptionSubject$.next();
    this.subscriptionSubject$.complete();
  }
}
