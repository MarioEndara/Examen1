import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';


@Injectable({ providedIn: 'root' })
export class ActasService {
  constructor(private sb: SupabaseService) {}

  private get supabase() { return this.sb.client; }

  async subirActa(mesaId: number, archivo: File) {
    const ruta = `${mesaId}/acta.jpg`;

    const { error: errSubida } = await this.supabase.storage
      .from('actas')
      .upload(ruta, archivo, { upsert: true, contentType: archivo.type });
    if (errSubida) throw errSubida;

    const { error: errBd } = await this.supabase
      .from('mesas')
      .update({ foto_acta_url: ruta })
      .eq('id', mesaId);
    if (errBd) throw errBd;
  }

  async verActa(ruta: string) {
    const { data, error } = await this.supabase.storage
      .from('actas')
      .createSignedUrl(ruta, 60);
    if (error) throw error;
    return data.signedUrl;
  }
  async usuarioActual() {
  const { data } = await this.supabase.auth.getUser();
  return data.user?.email ?? 'SIN SESIÓN';
  }
}