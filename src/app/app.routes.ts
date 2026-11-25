import type { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import {
  sesionGuard,
  passwordActualizadaGuard,
} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.page')
      .then(m => m.LoginPage),
  },
  {
    path: 'cambiar-password',
    canActivate: [sesionGuard],
    loadComponent: () => import('./features/auth/pages/cambiar-password/cambiar-password.page')
      .then(m => m.CambiarPasswordPage),
  },
  {
    path: 'recuperar-password',
    loadComponent: () => import('./features/auth/pages/recuperar-password/recuperar-password.page')
      .then(m => m.RecuperarPasswordPage),
  },
  {
    path: 'home',
    canActivate: [passwordActualizadaGuard],
    component: HomePage,
  },
  {
    path: 'actas-prueba',
    canActivate: [passwordActualizadaGuard],
    loadComponent: () => import('./features/actas/actas.page')
      .then(m => m.ActasPruebaPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
  path: 'crear-usuario',
  canActivate: [passwordActualizadaGuard],
  loadComponent: () => import('./features/usuarios/crear-usuario.page')
    .then(m => m.CrearUsuarioPage),
},
{
  path: '**',
  redirectTo: 'login',
},
];

