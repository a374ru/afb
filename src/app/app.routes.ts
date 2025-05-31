import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './fb/core/auth.guard';

export const routes: Routes = [
  {
    canActivateChild: [publicGuard()],
    path: 'auth',
    loadChildren: () => import('./fb/auth/features/auth.routes'),
  },
  {
    canActivateChild: [privateGuard()],
    path: 'entries',
    loadComponent: () => import('./fb/header/ui/layout.component'),
    loadChildren: () => import('./fb/entries/features/entry.routes'),
  },
  {
    path: '**', redirectTo: '/entries',
  },
];