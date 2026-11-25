import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AuthRepository } from '../core/data-access/auth.repository';
import { InicioRepository, type RecintoInicio } from '../core/data-access/inicio.repository';
import type { Perfil } from '../shared/models/perfil.model';
import type { Mesa } from '../shared/models/mesa.model';
import { AsignarVeedorComponent } from '../features/mesas/asignar-veedor.component';

@Component({
  selector: 'app-home', standalone: true, imports: [IonContent, RouterLink, AsignarVeedorComponent],
  templateUrl: './home.page.html', styleUrls: ['./home.page.scss'],
})
export class HomePage {
  private auth = inject(AuthRepository);
  private inicio = inject(InicioRepository);
  private router = inject(Router);
  private visita = 0;
  readonly perfil = signal<Perfil | null>(null);
  readonly recintos = signal<RecintoInicio[]>([]);
  readonly mesas = signal<Mesa[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly saliendo = signal(false);
  readonly roles = {coordinador_provincial:'Coordinación provincial', coordinador_recinto:'Coordinación de recinto', veedor:'Veedor de mesa'};

  async ionViewWillEnter() {
    const visita = ++this.visita;
    this.perfil.set(null);
    this.recintos.set([]);
    this.mesas.set([]);
    this.error.set('');
    this.cargando.set(true);
    try {
      const perfil = await this.auth.obtenerPerfil();
      const recintos = await this.inicio.recintos(perfil);
      const mesas = await this.inicio.mesas(perfil, recintos);
      if (visita !== this.visita) return;
      this.perfil.set(perfil);
      this.recintos.set(recintos);
      this.mesas.set(mesas.sort((a,b) => (a.recinto_id ?? 0)-(b.recinto_id ?? 0) || (a.numero_mesa ?? 0)-(b.numero_mesa ?? 0)));
    } catch (e) {
      if (visita === this.visita) this.error.set(e instanceof Error ? e.message : 'No se pudo cargar el panel.');
    } finally {
      if (visita === this.visita) this.cargando.set(false);
    }
  }

  async salir() {
    if (this.saliendo()) return;
    this.saliendo.set(true);
    try {
      await this.auth.logout();
      await this.router.navigateByUrl('/login', {replaceUrl:true});
    } catch { this.error.set('No se pudo cerrar la sesión. Intenta nuevamente.'); }
    finally { this.saliendo.set(false); }
  }
}
