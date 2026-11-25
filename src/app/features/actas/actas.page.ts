import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActasService } from './actas.service';
import { MensajeComponent } from '../../shared/mensaje/mensaje.component';

@Component({
  selector: 'app-actas-prueba',
  standalone: true,
  imports: [FormsModule, MensajeComponent],
  template: `
    <div
      style="padding:16px; font-family:sans-serif"
      [attr.aria-busy]="cargando"
    >
      <h2>Prueba de actas</h2>

      <p>Usuario: <strong>{{ usuario }}</strong></p>

      <p>
        Mesa id:
        <input
          type="number"
          min="1"
          step="1"
          [(ngModel)]="mesaId"
          (ngModelChange)="limpiarVista()"
          [disabled]="cargando"
          style="width:80px"
        >
      </p>

      <p>
        <input
          type="file"
          accept="image/*"
          (change)="onArchivo($event)"
          [disabled]="cargando"
        >
      </p>

      <button
        type="button"
        (click)="subir()"
        [disabled]="cargando"
      >
        Subir acta
      </button>

      <button
        type="button"
        (click)="ver()"
        [disabled]="cargando"
        style="margin-left:8px"
      >
        Ver acta
      </button>

      <app-mensaje [texto]="mensaje"></app-mensaje>

      @if (urlImagen) {
        <img
          [src]="urlImagen"
          alt="Fotografía del acta consultada"
          style="max-width:100%"
        >
      }
    </div>
  `,
})
export class ActasPruebaPage implements OnInit {
  usuario = '';
  mesaId = 1;
  archivo?: File;
  mensaje = '';
  urlImagen = '';
  cargando = false;

  constructor(private actas: ActasService) {}

  async ngOnInit() {
  try {
    this.usuario = await this.actas.usuarioActual();
  } catch (error: any) {
    this.mensaje =
      '❌ ' + (error?.message || 'No se pudo consultar la sesión.');
  }
}

  limpiarVista() {
    this.urlImagen = '';
    this.mensaje = '';
  }

  onArchivo(ev: Event) {
    this.archivo = (ev.target as HTMLInputElement).files?.[0];
    this.mensaje = '';
  }

  private validarMesa(): boolean {
    if (Number.isInteger(this.mesaId) && this.mesaId > 0) {
      return true;
    }

    this.mensaje = 'Ingresa un identificador de mesa entero y mayor que cero.';
    return false;
  }

  async subir() {
    if (this.cargando || !this.validarMesa()) return;

    if (!this.archivo) {
      this.mensaje = 'Primero elige una imagen';
      return;
    }

    this.cargando = true;
    this.mensaje = 'Subiendo acta...';

    try {
      await this.actas.subirActa(this.mesaId, this.archivo);
      this.mensaje = `✅ Acta subida a la mesa ${this.mesaId}`;
    } catch (error: any) {
      this.mensaje =
        '❌ ' + (error?.message || 'No se pudo subir el acta.');
    } finally {
      this.cargando = false;
    }
  }

  async ver() {
    if (this.cargando || !this.validarMesa()) return;

    this.cargando = true;
    this.urlImagen = '';
    this.mensaje = 'Consultando acta...';

    try {
      this.urlImagen = await this.actas.verActaDeMesa(this.mesaId);
      this.mensaje = `✅ Puede ver el acta de la mesa ${this.mesaId}`;
    } catch (error: any) {
      this.mensaje =
        '❌ ' + (error?.message || 'No se pudo consultar el acta.');
    } finally {
      this.cargando = false;
    }
  }
}