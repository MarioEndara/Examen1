import { inject } from '@angular/core';
import { Router } from '@angular/router';
import type { CanActivateFn } from '@angular/router';
import { AuthRepository } from '../data-access/auth.repository';

export const sesionGuard: CanActivateFn = async () => {
  const auth = inject(AuthRepository);
  const router = inject(Router);

  try {
    await auth.obtenerPerfil();
    return true;
  } catch {
    return router.createUrlTree(['/login'], {
      queryParams: { sesion: 'requerida' },
    });
  }
};

export const passwordActualizadaGuard: CanActivateFn = async () => {
  const auth = inject(AuthRepository);
  const router = inject(Router);

  try {
    const perfil = await auth.obtenerPerfil();
    if (perfil.debe_cambiar_password) {
      return router.createUrlTree(['/cambiar-password']);
    }
    return true;
  } catch {
    return router.createUrlTree(['/login'], {
      queryParams: { sesion: 'requerida' },
    });
  }
};

