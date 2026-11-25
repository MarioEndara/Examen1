import { Component, inject, input, signal } from '@angular/core';
import { AsignacionesRepository } from '../../core/data-access/asignaciones.repository';

@Component({
  selector: 'app-asignar-veedor',
  standalone: true,
  template: `
    @if (!abierto()) {
      <button type="button" (click)="abrir()">Asignar veedor</button>
    } @else {
      <form (submit)="guardar($event)">
        <label>
          Cédula del veedor
          <input
            #campo
            type="text"
            inputmode="numeric"
            maxlength="10"
            autocomplete="off"
            placeholder="10 dígitos"
            [value]="cedula()"
            (input)="cedula.set(campo.value)"
            [disabled]="guardando()"
          />
        </label>

        <div class="acciones">
          <button type="submit" [disabled]="guardando()">
            {{ guardando() ? 'Asignando…' : 'Confirmar asignación' }}
          </button>
          <button type="button" class="secundario"
            [disabled]="guardando()" (click)="cancelar()">
            Cancelar
          </button>
        </div>
      </form>
    }

    @if (exito()) { <p role="status">{{ exito() }}</p> }
    @if (error()) { <p role="alert">{{ error() }}</p> }
  `,
  styles: [`
    :host { display: block; flex-basis: 100%; }
    form { display: grid; gap: 10px; }
    label { display: grid; gap: 6px; font-weight: 600; }
    input {
      box-sizing: border-box; width: 100%; max-width: 320px;
      padding: 11px; border: 1px solid #82998e; border-radius: 8px;
      background: white; color: #153b35; font: inherit;
    }
    .acciones { display: flex; flex-wrap: wrap; gap: 8px; }
    button {
      padding: 11px 15px; border: 0; border-radius: 9px;
      background: #125546; color: white; font: inherit; cursor: pointer;
    }
    button:disabled { opacity: .65; }
    .secundario { background: #e0eee8; color: #153b35; }
    [role="status"] { color: #125546; }
    [role="alert"] { color: #a32323; }
  `],
})
export class AsignarVeedorComponent {
  readonly mesaId = input.required<number>();
  readonly numeroMesa = input.required<number | null>();
  readonly abierto = signal(false);
  readonly cedula = signal('');
  readonly guardando = signal(false);
  readonly exito = signal('');
  readonly error = signal('');

  private readonly repo = inject(AsignacionesRepository);

  abrir(): void {
    this.cedula.set('');
    this.error.set('');
    this.exito.set('');
    this.abierto.set(true);
  }

  cancelar(): void {
    this.abierto.set(false);
    this.cedula.set('');
    this.error.set('');
  }

  async guardar(evento: Event): Promise<void> {
    evento.preventDefault();
    if (this.guardando()) return;

    const cedula = this.cedula().trim();
    if (!/^\d{10}$/.test(cedula)) {
      this.error.set('Ingresa los 10 dígitos de la cédula del veedor.');
      return;
    }

    this.guardando.set(true);
    this.error.set('');

    try {
      await this.repo.asignarVeedor(this.mesaId(), cedula);
      this.abierto.set(false);
      this.cedula.set('');
      this.exito.set(`Veedor asignado a la mesa ${this.numeroMesa() ?? this.mesaId()}.`);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'No se pudo asignar el veedor.');
    } finally {
      this.guardando.set(false);
    }
  }
}