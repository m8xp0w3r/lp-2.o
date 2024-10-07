import { Routes } from '@angular/router';
import { panschSelectedGuard } from "@guards/pansch-selected.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [panschSelectedGuard]
  },
  {
    path: 'bowling',
    loadChildren: () => import('./pages/disciplines/01-bowling/bowling.routes').then(m => m.routes)
  },
  {
    path: 'billiard',
    loadChildren: () => import('./pages/disciplines/02-billiard/billiard.routes').then(m => m.routes)
  },
  {
    path: 'air-hockey',
    loadChildren: () => import('./pages/disciplines/03-air-hockey/air-hockey.routes').then(m => m.routes)
  },
  {
    path: 'kicker',
    loadChildren: () => import('./pages/disciplines/04-kicker/kicker.routes').then(m => m.routes)
  },
  {
    path: 'dart',
    loadChildren: () => import('./pages/disciplines/05-dart/dart.routes').then(m => m.routes)
  },
  {
    path: 'bonus',
    loadChildren: () => import('./pages/disciplines/bonus/bonus.routes').then(m => m.routes)
  },
  {
    path: 'ranking',
    loadComponent: () => import('./pages/disciplines/ranking/ranking.page').then(m => m.RankingPage),
    canActivate: [panschSelectedGuard]
  },
  {
    path: 'rules',
    loadComponent: () => import('./pages/disciplines/rules/rules.page').then(m => m.RulesPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/setup/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'pansch-administration',
    loadComponent: () => import('./pages/setup/pansch-administration/pansch-administration.page').then(m => m.PanschAdministrationPage),
    canActivate: [panschSelectedGuard]
  },
  {
    path: 'pansch-selection',
    loadComponent: () => import('./pages/setup/pansch-selection/pansch-selection.page').then(m => m.PanschSelectionPage)
  },
  {
    path: 'user-selection',
    loadComponent: () => import('./pages/setup/user-selection/user-selection.page').then(m => m.UserSelectionPage),
    canActivate: [panschSelectedGuard]
  },
];
