import { Component, inject } from "@angular/core";
import { AirHockeyService } from "./air-hockey.service";
import { environment } from "@environments/environment";
import { Router } from "@angular/router";
import { AuthService, LatschiPanschService } from "@services";

@Component({
    template: "",
    selector: "lp-base-hockey",
    standalone: false
})
export abstract class BaseAirHockeyPage {
  protected airHockeyService: AirHockeyService = inject(AirHockeyService);
  protected authService: AuthService = inject(AuthService);
  protected latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  protected router: Router = inject(Router);

  public currentUser$ = this.authService.currentUser$;
  public testMode = environment.testMode;
  public currentPansch$ = this.latschiPanschService.currentPansch$;
}
