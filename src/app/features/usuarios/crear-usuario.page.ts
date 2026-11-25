import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsuariosRepository } from '../../core/data-access/usuarios.repository';
import type { AltaUsuario } from '../../core/data-access/usuarios.repository';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  styles: [':host {display:block; overflow:auto; padding:20px} form {display:grid; gap:12px; max-width:420px} label,input {display:block} input {width:100%; padding:8px}'],
  template: `
    <a routerLink="/home">Volver a Inicio</a>
    <h1>Crear usuario</h1>
    <form #form="ngForm" (ngSubmit)="guardar()" ngNativeValidate>
      <label>Cédula<input name="cedula" [(ngModel)]="datos.cedula" inputmode="numeric" pattern="[0-9]{10}" required></label>
      <label>Nombres<input name="nombres" [(ngModel)]="datos.nombres" maxlength="100" required></label>
      <label>Apellidos<input name="apellidos" [(ngModel)]="datos.apellidos" maxlength="100" required></label>
      <label>Teléfono<input name="telefono" [(ngModel)]="datos.telefono" type="tel" required></label>
      <label>Correo de invitación<input name="email" [(ngModel)]="datos.email" type="email" required></label>
      <label>ID del recinto<input [readOnly]="recintoElegido() !== null" name="recinto" [(ngModel)]="datos.recinto_id" type="number" min="1" step="1" required></label>
      <button type="submit" [disabled]="ocupado() || form.invalid">{{ ocupado() ? 'Enviando…' : 'Crear e invitar' }}</button>
    </form>
    <p role="status">{{ mensaje() }}</p>
  `,
})
export class CrearUsuarioPage {
  private route = inject(ActivatedRoute);
  recintoElegido = signal<number | null>(null);
  ionViewWillEnter() {
    const id = Number(this.route.snapshot.queryParamMap.get('recinto'));
    this.recintoElegido.set(Number.isSafeInteger(id) && id > 0 ? id : null);
    this.datos = this.vacio();
    this.mensaje.set('');
  }
  private repo = inject(UsuariosRepository);
  ocupado = signal(false);
  mensaje = signal('');
  private vacio(): AltaUsuario {
    return { cedula: '', nombres: '', apellidos: '', telefono: '', email: '', recinto_id: this.recintoElegido() };
  }
  datos = this.vacio();

  async guardar() {
    if (this.ocupado()) return;
    this.ocupado.set(true);
    this.mensaje.set('');
    try {
      this.mensaje.set(await this.repo.crear(this.datos));
      this.datos = this.vacio();
    } catch (error) {
      this.mensaje.set(error instanceof Error ? error.message : 'No se pudo crear la cuenta.');
    } finally {
      this.ocupado.set(false);
    }
  }
}
