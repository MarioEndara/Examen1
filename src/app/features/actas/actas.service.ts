import { Injectable } from '@angular/core';
import { ActasRepository } from '../../core/data-access/actas.repository';

@Injectable({
  providedIn: 'root'
})
export class ActasService {
  constructor(private repo: ActasRepository) {}

  private rutaActa(mesaId: number): string {
    return `${mesaId}/acta.jpg`;
  }

  async subirActa(mesaId: number, archivo: File): Promise<void> {
    const ruta = this.rutaActa(mesaId);

    await this.repo.subirArchivo(ruta, archivo);
    await this.repo.actualizarRutaMesa(mesaId, ruta);
  }

  verActa(ruta: string): Promise<string> {
    return this.repo.crearUrlFirmada(ruta);
  }

  verActaDeMesa(mesaId: number): Promise<string> {
    return this.verActa(this.rutaActa(mesaId));
  }

  async usuarioActual(): Promise<string> {
    const email = await this.repo.obtenerEmailActual();

    return email ?? 'SIN SESIÓN';
  }
}