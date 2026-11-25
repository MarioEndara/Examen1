import { Injectable } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { Mesa } from '../../shared/models/mesa.model';
@Injectable({
  providedIn: 'root'
})
export class MesasRepository {
  constructor(private supabase: SupabaseService) {}

  async getMesas(): Promise<Mesa[]> {
    const { data, error } = await this.supabase.client
      .from('mesas')
      .select('*');
      
    if (error) throw error;
    return data as Mesa[];
  }
}