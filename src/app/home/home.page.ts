import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';
import { SupabaseService } from '../core/services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {
  constructor(private supabaseService: SupabaseService) {}
  
    async ngOnInit() {
    console.log('--- INICIANDO PRUEBA DE SEGURIDAD RLS ---');
    
    // 1. ¿Quién está logueado?
    const { data: { user } } = await this.supabaseService.client.auth.getUser();
    console.log('Usuario actual:', user?.email, 'ID:', user?.id);

    // 2. ¿Cuál es el rol de este usuario?
    const { data: perfil, error: errPerfil } = await this.supabaseService.client
      .from('perfiles')
      .select('role')
      .eq('id', user?.id)
      .single();
    console.log('Rol en perfiles:', perfil?.role, 'Error:', errPerfil);

    // 3. Consultar recintos (para ver si el coordinador tiene el suyo)
    const { data: recintos } = await this.supabaseService.client
      .from('recintos')
      .select('*');
    console.log('Recintos visibles:', recintos);

    // 4. Consultar mesas (lo que ya hacíamos)
    const { data: mesas, error: errMesas } = await this.supabaseService.client
      .from('mesas')
      .select('*');
    console.log('Mesas visibles:', mesas, 'Error:', errMesas);
  }
}