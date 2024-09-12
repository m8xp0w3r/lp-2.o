import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'lp-user-selection',
  templateUrl: './user-selection.page.html',
  styleUrls: ['./user-selection.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class UserSelectionPage implements OnInit, OnDestroy {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  private subscriptionSubject: Subject<void> = new Subject<void>();
  private router: Router = inject(Router);

  async ngOnInit(): Promise<void> {
    const currentPansch = await firstValueFrom(this.latschiPanschService.currentPansch$);
    if (currentPansch) {
      this.latschiPanschService.players$
        .pipe(takeUntil(this.subscriptionSubject))
        .subscribe(players => {
          if (players.length === 16) {
            this.router.navigate(["/home"]);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.subscriptionSubject.next();
    this.subscriptionSubject.complete();
  }

}
