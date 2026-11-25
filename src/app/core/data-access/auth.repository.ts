import { Injectable } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRepository {
  constructor(private supabase: SupabaseService) {}

  async login(email: string, password: string) {
    return await this.supabase.client.auth.signInWithPassword({ email, password });
  }

  async logout() {
    return await this.supabase.client.auth.signOut();
  }
}