import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { interval, Subject, takeUntil } from "rxjs";
import { NgIf } from '@angular/common';

@Component({
    selector: 'lp-pansch-countdown',
    templateUrl: './pansch-countdown.component.html',
    styleUrls: ['./pansch-countdown.component.scss'],
    standalone: true,
    imports: [NgIf],
})
export class PanschCountdownComponent implements OnInit, OnDestroy {
  private panschDate: Date = new Date("November 1, 2024 18:00:00");
  private subscriptionSubject: Subject<void> = new Subject<void>();

  public remainingDays: WritableSignal<number | undefined> = signal(undefined);
  public remainingHours: WritableSignal<number | undefined> = signal(undefined);
  public remainingMinutes: WritableSignal<number | undefined> = signal(undefined);
  public remainingSeconds: WritableSignal<number | undefined> = signal(undefined);

  ngOnInit(): void {
    interval(1000)
      .pipe(takeUntil(this.subscriptionSubject))
      .subscribe(() => {
        const secondsToPansch = Math.floor((this.panschDate.getTime() - new Date().getTime()) / 1000);
        const daysToPansch = Math.floor(secondsToPansch / 24 / 60 / 60);
        const restSecondsFromDays = secondsToPansch - (daysToPansch * 24 * 60 * 60);
        const remainingHours = Math.floor(restSecondsFromDays / 60 / 60);
        const restSecondsFromHours = secondsToPansch -((daysToPansch * 24 * 60 * 60) + (remainingHours * 60 * 60));
        const remainingMinutes = Math.floor(restSecondsFromHours / 60);
        const restSecondsFromMinutes = secondsToPansch - ((daysToPansch * 24 * 60 * 60) + (remainingHours * 60 * 60) + (remainingMinutes * 60));

        this.remainingDays.set(Math.abs(daysToPansch));
        this.remainingHours.set(Math.abs(remainingHours));
        this.remainingMinutes.set(Math.abs(remainingMinutes));
        this.remainingSeconds.set(Math.abs(restSecondsFromMinutes));
      });

  }

  ngOnDestroy(): void {
    this.subscriptionSubject.next();
    this.subscriptionSubject.complete();
  }
}
