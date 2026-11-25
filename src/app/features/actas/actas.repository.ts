import { Injectable } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ActasRepository {
  constructor(private sb: SupabaseService) {}

  async subirArchivo(ruta: string, archivo: File): Promise<void> {
    const { error } = await this.sb.client.storage
      .from('actas')
      .upload(ruta, archivo, {
        upsert: true,
        contentType: archivo.type
      });

    if (error) throw error;
  }

  async actualizarRutaMesa(
    mesaId: number,
    ruta: string
  ): Promise<void> {
    const { error } = await this.sb.client
      .from('mesas')
      .update({ foto_acta_url: ruta })
      .eq('id', mesaId);

    if (error) throw error;
  }

  async crearUrlFirmada(ruta: string): Promise<string> {
    const { data, error } = await this.sb.client.storage
      .from('actas')
      .createSignedUrl(ruta, 60);

    if (error) throw error;

    return data.signedUrl;
  }

  async obtenerEmailActual(): Promise<string | null> {
    const { data } = await this.sb.client.auth.getUser();

    return data.user?.email ?? null;
  }
}