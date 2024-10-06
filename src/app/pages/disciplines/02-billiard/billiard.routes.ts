import { Routes } from "@angular/router";
import { BilliardPage } from "@pages/disciplines/02-billiard/billiard.page";

export const routes: Routes = [
  {
    path: 'tabs',
    component: BilliardPage,
    children: [
      {
        path: 'billiard-input',
        loadComponent: () => import('./billiard-input/billiard-input.page').then(m => m.BilliardInputPage)
      },
      {
        path: 'billiard-results',
        loadComponent: () => import('./billiard-result/billiard-result.page').then(m => m.BilliardResultPage)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/billiard-input',
    pathMatch: 'full'
  },
  {
    path: 'billiard-results',
    redirectTo: 'tabs/billiard-results',
    pathMatch: 'full'
  },
  {
    path: 'billiard-input',
    redirectTo: 'tabs/billiard-input',
    pathMatch: 'full'
  }
];
