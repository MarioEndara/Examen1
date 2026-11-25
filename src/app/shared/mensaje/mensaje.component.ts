import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mensaje',
  standalone: true,
  template: `
    @if (texto) {
      <p role="status"><strong>{{ texto }}</strong></p>
    }
  `
})
export class MensajeComponent {
  @Input() texto = '';
}