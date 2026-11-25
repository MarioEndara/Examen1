import { Injectable } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import type { Perfil } from '../../shared/models/perfil.model';
import { environment } from '../../../environments/environment';

interface RespuestaAcceso {
  perfil?: Perfil;
  session?: {
    access_token: string;
    refresh_token: string;
  };
  mensaje?: string;
  error?: string;
  password_actualizada?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthRepository {
  constructor(private sb: SupabaseService) {}

  async login(cedula: string, password: string): Promise<Perfil> {
    const respuesta = await this.invocar('login', {
      cedula: cedula.trim(),
      password,
    });

    if (!respuesta.perfil || !respuesta.session) {
      throw new Error('El servicio no devolvió una sesión válida.');
    }

    const { error } = await this.sb.client.auth.setSession(respuesta.session);
    if (error) throw new Error(error.message);

    return respuesta.perfil;
  }

  async obtenerPerfil(): Promise<Perfil> {
    const respuesta = await this.invocar('perfil', {}, true);
    if (!respuesta.perfil) {
      throw new Error('No se pudo obtener el perfil de la sesión.');
    }
    return respuesta.perfil;
  }

  async cambiarPassword(nuevaPassword: string): Promise<void> {
    await this.invocar('cambiar-password', { nuevaPassword }, true);
    try {
      await this.logout();
    } catch {
      throw new Error(
        'La contraseña ya se actualizó, pero no se pudo cerrar la sesión. ' +
        'Pulsa Salir y vuelve a ingresar con la nueva contraseña.'
      );
    }
  }

  async recuperarPassword(email: string): Promise<void> {
    const configuracion = environment as typeof environment & {
      authRedirectUrl?: string;
    };
    const redirectTo = configuracion.authRedirectUrl ||
      new URL('/cambiar-password', window.location.origin).href;

    const { error } = await this.sb.client.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo }
    );
    if (error) throw new Error(error.message);
  }

  async logout(): Promise<void> {
    const { error } = await this.sb.client.auth.signOut({ scope: 'local' });
    if (error) throw new Error(error.message);
  }

  private async invocar(
    accion: 'login' | 'perfil' | 'cambiar-password',
    datos: Record<string, unknown> = {},
    requiereSesion = false
  ): Promise<RespuestaAcceso> {
    let headers: Record<string, string> | undefined;

    if (requiereSesion) {
      const { data, error } = await this.sb.client.auth.getSession();
      if (error) throw new Error(error.message);
      if (!data.session) {
        throw new Error('Inicia sesión para continuar.');
      }
      headers = {
        Authorization: 'Bearer ' + data.session.access_token,
      };
    }

    const { data, error } =
      await this.sb.client.functions.invoke<RespuestaAcceso>('acceso', {
        body: { ...datos, accion },
        ...(headers ? { headers } : {}),
      });

    if (error) {
      let mensaje = error.message || 'No se pudo conectar con el servicio de acceso.';
      const contexto = (error as unknown as { context?: Response }).context;

      if (contexto && typeof contexto.json === 'function') {
        try {
          const detalle: unknown = await contexto.json();
          if (
            detalle && typeof detalle === 'object' &&
            'error' in detalle && typeof detalle.error === 'string'
          ) {
            mensaje = detalle.error;
          }
        } catch {
          // Se conserva el mensaje original si no hay una respuesta JSON.
        }
      }
      throw new Error(mensaje);
    }

    if (!data) throw new Error('El servicio no devolvió una respuesta.');
    if (data.error) throw new Error(data.error);
    return data;
  }
}

