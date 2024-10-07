import { Routes } from "@angular/router";
import { KickerPage } from "@pages/disciplines/04-kicker/kicker.page";
import { panschSelectedGuard } from "@guards/pansch-selected.guard";

export const routes: Routes = [
  {
    path: 'tabs',
    component: KickerPage,
    children: [
      {
        path: 'kicker-vf',
        loadComponent: () => import('./kicker-vf/kicker-vf.page').then(m => m.KickerVfPage),
        canActivate: [panschSelectedGuard]
      },
      {
        path: 'kicker-hf',
        loadComponent: () => import('./kicker-hf/kicker-hf.page').then(m => m.KickerHfPage),
        canActivate: [panschSelectedGuard]
      },
      {
        path: 'kicker-final',
        loadComponent: () => import('./kicker-final/kicker-final.page').then(m => m.KickerFinalPage),
        canActivate: [panschSelectedGuard]
      },
      {
        path: 'kicker-result',
        loadComponent: () => import('./kicker-result/kicker-result.page').then(m => m.KickerResultPage),
        canActivate: [panschSelectedGuard]
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/kicker-vf',
    pathMatch: 'full'
  },
  {
    path: 'kicker-vf',
    redirectTo: 'tabs/kicker-vf',
    pathMatch: 'full'
  },
  {
    path: 'kicker-hf',
    redirectTo: 'tabs/kicker-hf',
    pathMatch: 'full'
  },
  {
    path: 'kicker-final',
    redirectTo: 'tabs/kicker-final',
    pathMatch: 'full'
  },
  {
    path: 'kicker-result',
    redirectTo: 'tabs/kicker-result',
    pathMatch: 'full'
  }
]
