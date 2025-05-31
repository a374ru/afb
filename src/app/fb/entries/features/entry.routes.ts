import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./entry/entry-list.component'),
  },
  {
    path: 'new',
    loadComponent: () => import('./form/entry-form.component'),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./form/entry-form.component'),
  },
] as Routes;
