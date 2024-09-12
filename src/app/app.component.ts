import { Component, inject, OnInit, signal } from '@angular/core';
import {
  IonApp,
  IonContent, IonIcon, IonItem, IonLabel,
  IonList,
  IonListHeader,
  IonMenu, IonMenuToggle, IonNote,
  IonRouterOutlet,
  IonSplitPane
} from '@ionic/angular/standalone';
import { LatschiPanschService, SideMenuService } from "@services";
import { Observable } from "rxjs";
import { LatschiPansch, SideMenuItem } from "@interfaces";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'lp-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, RouterLink, NgForOf, AsyncPipe, RouterLinkActive, NgIf],
})
export class AppComponent implements OnInit {
  private latschiPanschService: LatschiPanschService = inject(LatschiPanschService);
  private sideMenuService: SideMenuService = inject(SideMenuService);

  public appPages$: Observable<SideMenuItem[]> = this.sideMenuService.appPages$;
  public latschiPansch = signal<LatschiPansch | undefined>(undefined);

  constructor() {
  }

  async ngOnInit(): Promise<void> {
    this.latschiPanschService.currentPansch$.subscribe((pansch: LatschiPansch | undefined) => {
      this.latschiPansch.set(pansch);
    });
  }
}
