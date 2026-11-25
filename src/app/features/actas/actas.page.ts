import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActasService } from './actas.service';

@Component({
  selector: 'app-actas-prueba',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div style="padding:16px; font-family:sans-serif">
      <h2>Prueba de actas</h2>
      <p>Usuario: <strong>{{ usuario }}</strong></p>
      <p>Mesa id: <input type="number" [(ngModel)]="mesaId" style="width:80px"></p>
      <p><input type="file" accept="image/*" (change)="onArchivo($event)"></p>
      <button (click)="subir()">Subir acta</button>
      <button (click)="ver()" style="margin-left:8px">Ver acta</button>
      <p><strong>{{ mensaje }}</strong></p>
      @if (urlImagen) { <img [src]="urlImagen" style="max-width:100%"> }
    </div>
  `,
})
export class ActasPruebaPage implements OnInit {
  usuario = '';
  mesaId = 1;
  archivo?: File;
  mensaje = '';
  urlImagen = '';

  constructor(private actas: ActasService) {}

  async ngOnInit() {
    this.usuario = await this.actas.usuarioActual();
  }

  onArchivo(ev: Event) {
    this.archivo = (ev.target as HTMLInputElement).files?.[0];
  }

  async subir() {
    if (!this.archivo) { this.mensaje = 'Primero elige una imagen'; return; }
    try {
      await this.actas.subirActa(this.mesaId, this.archivo);
      this.mensaje = `✅ Acta subida a la mesa ${this.mesaId}`;
    } catch (e: any) {
      this.mensaje = `❌ ${e.message}`;
    }
  }

  async ver() {
    try {
      this.urlImagen = await this.actas.verActa(`${this.mesaId}/acta.jpg`);
      this.mensaje = `✅ Puede ver el acta de la mesa ${this.mesaId}`;
    } catch (e: any) {
      this.urlImagen = '';
      this.mensaje = `❌ ${e.message}`;
    }
  }
}