import { Routes } from "@angular/router";
import { BowlingPage } from "@pages/disciplines/01-bowling/bowling.page";

export const routes: Routes = [
  {
    path: 'tabs',
    component: BowlingPage,
    children: [
      {
        path: 'bowling-input',
        loadComponent: () => import('./bowling-input/bowling-input.page').then(m => m.BowlingInputPage),
      },
      {
        path: 'bowling-results',
        loadComponent: () => import('./bowling-results/bowling-results.page').then(m => m.BowlingResultsPage),
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/bowling-input',
    pathMatch: 'full',
  },
  {
    path: 'bowling-results',
    redirectTo: 'tabs/bowling-results',
    pathMatch: 'full',
  },
  {
    path: 'bowling-input',
    redirectTo: 'tabs/bowling-input',
    pathMatch: 'full',
  },
];
