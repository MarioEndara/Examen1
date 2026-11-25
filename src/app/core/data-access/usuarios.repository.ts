import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

export interface AltaUsuario {
  cedula: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  recinto_id: number | null;
}

@Injectable({ providedIn: 'root' })
export class UsuariosRepository {
  private client = inject(SupabaseService).client;

  async crear(datos: AltaUsuario): Promise<string> {
    const { data, error } = await this.client.functions.invoke('crear-usuario', { body: datos });
    if (error) {
      const detalle = error.context instanceof Response
        ? await error.context.json().catch(() => null)
        : null;
      throw new Error(detalle?.error ?? error.message);
    }
    return data.mensaje;
  }
}
