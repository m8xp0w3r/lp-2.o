import { inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ActivatedRouteSnapshot, Router, UrlTree } from "@angular/router";

import { User } from "@angular/fire/auth";
import { AuthService, LatschiPanschService, PlayerService } from "@services";
import { LatschiPansch, Player } from "@interfaces";

export const panschSelectedGuard = async (route: ActivatedRouteSnapshot): Promise<UrlTree | boolean> => {
  const playerService: PlayerService = inject(PlayerService);
  const authService: AuthService = inject(AuthService);
  const latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  const router: Router = inject(Router);
  const pansch: LatschiPansch | undefined = (await firstValueFrom(latschiPanschService.currentPansch$));
  const currentUser: User | null = await firstValueFrom(authService.currentUser$);
  if (!pansch) {
    console.log("Nicht pansch");
    return router.parseUrl('/pansch-selection');
  }
  if (currentUser) {
    console.log("currentUser");
    if (route.routeConfig?.path === "user-selection") {
      return true;
    }
  }
  const players: Player[] = await playerService.getPlayerSnapshot(pansch);
  if (players.length !== 16) {
    console.log("players.length", players.length);
    if (currentUser) {
      return router.parseUrl('/user-selection');
    }
    return router.parseUrl('/home');
  }
  if (!currentUser) {
    if (route.routeConfig?.path === "home") {
      return true;
    }
  }

  return true;
};
