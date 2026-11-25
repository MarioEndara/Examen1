import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

@Injectable({ providedIn: 'root' })
export class AsignacionesRepository {
  private readonly supabase = inject(SupabaseService);

  async asignarVeedor(mesaId: number, cedula: string): Promise<void> {
    const { error } = await this.supabase.client.rpc(
      'asignar_veedor_a_mesa',
      {
        p_mesa_id: mesaId,
        p_cedula: cedula,
      }
    );

    if (error) throw new Error(error.message);
  }
}