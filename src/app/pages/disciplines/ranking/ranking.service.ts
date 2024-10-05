import { inject, Injectable } from '@angular/core';
import { AuthService, LatschiPanschService } from "@services";
import { BehaviorSubject, combineLatest, map, Observable } from "rxjs";
import { Player } from "@interfaces";


@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  private authService: AuthService = inject(AuthService);
  private coinFlipNeededSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private currentUser$ = this.authService.currentUser$;

  public players$: Observable<Player[]> = combineLatest([this.latschiPanschService.players$, this.latschiPanschService.currentPansch$, this.currentUser$])
    .pipe(
      map(([players, currentPansch, currentUser]) => {
        players.sort((a, b) => (a.finalRank ?? 0) - (b.finalRank ?? 0));
        const coinFlipMap: Map<number, number> = new Map<number, number>();
        players.forEach(player => {
          if (player.finalRank && player.finalRank! < 4) {
            coinFlipMap.set(player.finalRank, (coinFlipMap.get(player.finalRank) ?? 0) + 1);
          }
        });
        this.coinFlipNeededSubject$.next(Array
          .from(coinFlipMap.values())
          .map((count: number) => count > 1)
          .reduce((previousValue, currentValue) => previousValue || currentValue));

        if (!currentUser && currentPansch && !currentPansch.isReleased) {
          return [];
        }
        return players;
      })
    );
  public coinFlipNeeded$: Observable<boolean> = this.coinFlipNeededSubject$.asObservable();
}
