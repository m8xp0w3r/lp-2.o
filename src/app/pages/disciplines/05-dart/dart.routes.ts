import { Routes } from "@angular/router";
import { DartPage } from "@pages/disciplines/05-dart/dart.page";

export const routes: Routes = [
  {
    path: 'tabs',
    component: DartPage,
    children: [
      {
        path: 'dart-preliminary',
        loadComponent: () => import('./dart-preliminary/dart-preliminary.page').then(m => m.DartPreliminaryPage)
      },
      {
        path: 'dart-final',
        loadComponent: () => import('./dart-final/dart-final.page').then(m => m.DartFinalPage)
      },
      {
        path: 'dart-result',
        loadComponent: () => import('./dart-result/dart-result.page').then(m => m.DartResultPage)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/dart-preliminary',
    pathMatch: 'full'
  },
  {
    path: 'dart-preliminary',
    redirectTo: 'tabs/dart-preliminary',
    pathMatch: 'full'
  },
  {
    path: 'dart-final',
    redirectTo: 'tabs/dart-final',
    pathMatch: 'full'
  },
  {
    path: 'dart-result',
    redirectTo: 'tabs/dart-result',
    pathMatch: 'full'
  }
]
