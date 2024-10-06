import { Routes } from "@angular/router";
import { AirHockeyPage } from "@pages/disciplines/03-air-hockey/air-hockey.page";

export const routes: Routes = [
  {
    path: 'tabs',
    component: AirHockeyPage,
    children: [
      {
        path: 'air-hockey-af',
        loadComponent: () => import('./air-hockey-af/air-hockey-af.page').then(m => m.AirHockeyAfPage)
      },
      {
        path: 'air-hockey-vf',
        loadComponent: () => import('./air-hockey-vf/air-hockey-vf.page').then(m => m.AirHockeyVfPage)
      },
      {
        path: 'air-hockey-hf',
        loadComponent: () => import('./air-hockey-hf/air-hockey-hf.page').then(m => m.AirHockeyHfPage)
      },
      {
        path: 'air-hockey-final',
        loadComponent: () => import('./air-hockey-final/air-hockey-final.page').then(m => m.AirHockeyFinalPage)
      },
      {
        path: 'air-hockey-result',
        loadComponent: () => import('./air-hockey-result/air-hockey-result.page').then(m => m.AirHockeyResultPage)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/air-hockey-af',
    pathMatch: 'full'
  },
  {
    path: 'air-hockey-af',
    redirectTo: 'tabs/air-hockey-af',
    pathMatch: 'full'
  },
  {
    path: 'air-hockey-vf',
    redirectTo: 'tabs/air-hockey-vf',
    pathMatch: 'full'
  },
  {
    path: 'air-hockey-hf',
    redirectTo: 'tabs/air-hockey-hf',
    pathMatch: 'full'
  },
  {
    path: 'air-hockey-final',
    redirectTo: 'tabs/air-hockey-final',
    pathMatch: 'full'
  },
  {
    path: 'air-hockey-result',
    redirectTo: 'tabs/air-hockey-result',
    pathMatch: 'full'
  }

]
