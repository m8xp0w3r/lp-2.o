import { Routes } from "@angular/router";
import { BonusPage } from "@pages/disciplines/bonus/bonus.page";
import { panschSelectedGuard } from "@guards/pansch-selected.guard";

export const routes: Routes = [
  {
    path: 'tabs',
    component: BonusPage,
    children: [
      {
        path: 'bonus-input',
        loadComponent: () => import('./bonus-input/bonus-input.page').then(m => m.BonusInputPage),
        canActivate: [panschSelectedGuard],
      },
      {
        path: 'bonus-results',
        loadComponent: () => import('./bonus-results/bonus-results.page').then(m => m.BonusResultsPage),
        canActivate: [panschSelectedGuard],
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/bonus-input',
    pathMatch: 'full',
  },
  {
    path: 'bonus-results',
    redirectTo: 'tabs/bonus-results',
    pathMatch: 'full',
  },
  {
    path: 'bonus-input',
    redirectTo: 'tabs/bonus-input',
    pathMatch: 'full',
  },
];
