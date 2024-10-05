import { Component, inject } from "@angular/core";
import { environment } from "@environments/environment";

import { Router } from "@angular/router";
import { KickerService } from "./kicker.service";
import { AuthService, LatschiPanschService } from "@services";

@Component({
  template: "",
  selector: "lp-base-kicker"
})
export abstract class BaseKickerPage {
  protected kickerService: KickerService = inject(KickerService);
  protected authService: AuthService = inject(AuthService);
  protected latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  protected router: Router = inject(Router);

  public currentUser$ = this.authService.currentUser$;
  public testMode = environment.testMode;
  public currentPansch$ = this.latschiPanschService.currentPansch$;
}
