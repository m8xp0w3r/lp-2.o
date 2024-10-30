import { Component, inject } from '@angular/core';
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane
} from '@ionic/angular/standalone';
import { LatschiPanschService, SideMenuService } from "@services";
import { Observable } from "rxjs";
import { SideMenuItem } from "@interfaces";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { addIonicIcons } from "@util/icon.util";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: 'lp-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle, IonItem, IonIcon, IonLabel, RouterLink, NgForOf, AsyncPipe, RouterLinkActive, NgIf],
})
export class AppComponent {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  public latschiPansch = toSignal(this.latschiPanschService.currentPansch$);
  private sideMenuService: SideMenuService = inject(SideMenuService);
  public appPages$: Observable<SideMenuItem[]> = this.sideMenuService.appPages$;

  constructor() {
    addIonicIcons();
  }

}
