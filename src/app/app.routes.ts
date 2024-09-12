import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'air-hockey',
    loadComponent: () => import('./pages/disciplines/03-air-hockey/air-hockey.page').then( m => m.AirHockeyPage)
  },
  {
    path: 'kicker',
    loadComponent: () => import('./pages/disciplines/04-kicker/kicker.page').then( m => m.KickerPage)
  },
  {
    path: 'dart',
    loadComponent: () => import('./pages/disciplines/05-dart/dart.page').then( m => m.DartPage)
  },
  {
    path: 'bowling',
    loadComponent: () => import('./pages/disciplines/01-bowling/bowling.page').then( m => m.BowlingPage)
  },
  {
    path: 'billard',
    loadComponent: () => import('./pages/disciplines/02-billard/billard.page').then( m => m.BillardPage)
  },
  {
    path: 'bonus',
    loadComponent: () => import('./pages/disciplines/bonus/bonus.page').then( m => m.BonusPage)
  },
  {
    path: 'ranking',
    loadComponent: () => import('./pages/disciplines/ranking/ranking.page').then( m => m.RankingPage)
  },
  {
    path: 'rules',
    loadComponent: () => import('./pages/disciplines/rules/rules.page').then( m => m.RulesPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/setup/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'pansch-administration',
    loadComponent: () => import('./pages/setup/pansch-administration/pansch-administration.page').then( m => m.PanschAdministrationPage)
  },
  {
    path: 'pansch-selection',
    loadComponent: () => import('./pages/setup/pansch-selection/pansch-selection.page').then( m => m.PanschSelectionPage)
  },
  {
    path: 'user-selection',
    loadComponent: () => import('./pages/setup/user-selection/user-selection.page').then( m => m.UserSelectionPage)
  },
];
