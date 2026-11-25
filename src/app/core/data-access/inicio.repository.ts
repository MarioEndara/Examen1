import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { MesasRepository } from './mesas.repository';
import type { Perfil } from '../../shared/models/perfil.model';
import type { Mesa } from '../../shared/models/mesa.model';

export interface RecintoInicio {
  id: number;
  nombre: string;
  parroquia: string | null;
  coordinador_id: string | null;
}

@Injectable({providedIn: 'root'})
export class InicioRepository {
  private db = inject(SupabaseService).client;
  private mesasRepo = inject(MesasRepository);

  async recintos(p: Perfil): Promise<RecintoInicio[]> {
    if (p.role === 'veedor' || p.provincia_id === null) return [];
    let consulta = this.db.from('recintos').select('id,nombre,parroquia,coordinador_id')
      .eq('provincia_id', p.provincia_id);
    if (p.role === 'coordinador_recinto') consulta = consulta.eq('coordinador_id', p.id);
    const {data,error} = await consulta.order('nombre');
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async mesas(p: Perfil, recintos: RecintoInicio[]): Promise<Mesa[]> {
    const visibles = await this.mesasRepo.getMesas();
    if (p.role === 'veedor') {
      const {data,error} = await this.db.from('asignaciones_veedor').select('mesa_id').eq('veedor_id',p.id);
      if (error) throw new Error(error.message);
      const ids = new Set((data ?? []).map(a => a.mesa_id));
      return visibles.filter(m => ids.has(m.id));
    }
    return visibles.filter(m => recintos.some(r => r.id === m.recinto_id));
  }
}
