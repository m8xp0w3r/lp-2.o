import { Component, inject } from "@angular/core";
import { environment } from "@environments/environment";

import { Router } from "@angular/router";
import { KickerService } from "./kicker.service";
import { AuthService, LatschiPanschService } from "@services";

@Component({
  template: "",
  selector: "lp-base-kicker",
  standalone: false,
})
export abstract class BaseKickerPage {
  public testMode = environment.testMode;
  protected kickerService: KickerService = inject(KickerService);
  protected authService: AuthService = inject(AuthService);
  public currentUser$ = this.authService.currentUser$;
  protected latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  public currentPansch$ = this.latschiPanschService.currentPansch$;
  protected router: Router = inject(Router);
}
