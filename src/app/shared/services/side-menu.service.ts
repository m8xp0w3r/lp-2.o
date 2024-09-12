import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable } from "rxjs";
import { LatschiPanschService } from "./latschi-pansch.service";
import { AuthService } from "./auth.service";
import { User } from "@angular/fire/auth";
import { LatschiPansch, SideMenuItem } from "@interfaces";
import { DisciplineIconName } from "@enums";

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  private authService: AuthService = inject(AuthService);
  private sideMenuBaseItems: SideMenuItem[] = [
    { title: 'Home', url: '/home', icon: 'home', isBaseItem: true, order: 1 },
    { title: 'Regeln', url: '/rules', icon: 'clipboard', isBaseItem: true, order: 80 },
    {
      title: 'Pansch Einstellungen',
      url: '/pansch-administration',
      icon: 'settings',
      isBaseItem: false,
      isAdminItem: true,
      order: 75
    },
    { title: 'Anmelden', url: '/login', icon: 'log-in', isBaseItem: true, order: 90 }
  ];
  private currentPansch$: Observable<LatschiPansch | undefined> = this.latschiPanschService.currentPansch$;
  private gameInitialized$: Observable<boolean> = this.latschiPanschService.gameInitialized$;
  private currentUser$: Observable<User | null> = this.authService.currentUser$;

  public appPages$: Observable<SideMenuItem[]> = combineLatest([this.gameInitialized$, this.currentUser$, this.currentPansch$])
    .pipe(map(([gameInitialized, currentUser, selectedPansch]) => {
        const menuItems = [...this.sideMenuBaseItems.filter(item => {
          if (currentUser) {
            if (item.url === "/login") {
              item.title = "Abmelden";
            }
            if (!selectedPansch) {
              return item.isBaseItem;
            }
            return item.isBaseItem || item.isAdminItem || gameInitialized;
          }
          if (item.url === "/login") {
            item.title = "Anmelden";
          }
          if (!selectedPansch) {
            return item.isBaseItem;
          }
          return item.isBaseItem || (!item.isAdminItem && gameInitialized);
        })];
        if (selectedPansch) {
          if (selectedPansch.setupComplete) {
            menuItems.push({ title: 'Bowling', url: '/bowling', icon: DisciplineIconName.bowling, order: 10 });
            menuItems.push({ title: 'Bonus', url: '/bonus', icon: DisciplineIconName.bonus, order: 60 });
          }
          if (selectedPansch.bowlingCalculationFinished) {
            menuItems.push({ title: 'Billard', url: '/billiard', icon: DisciplineIconName.billiard, order: 20 });
          }
          if (selectedPansch.billiardCalculationFinished) {
            menuItems.push({ title: 'Air Hockey', url: '/air-hockey', icon: DisciplineIconName.airHockey, order: 30 });
          }
          if (selectedPansch.airHockeyCalculationFinished) {
            menuItems.push({ title: 'Kicker', url: '/kicker', icon: DisciplineIconName.kicker, order: 40 });
          }
          if (selectedPansch.kickerCalculationFinished) {
            menuItems.push({ title: 'Dart', url: '/dart', icon: DisciplineIconName.dart, order: 50 });
          }
          menuItems.push({ title: 'Endergebnis', url: '/ranking', icon: 'stats-chart', order: 70 });
        }
        menuItems.sort((a, b) => a.order - b.order);
        return menuItems;
      }
    ));

  constructor() {
  }
}
