import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonButton, IonSpinner, IonText,
} from '@ionic/angular';
import { AuthRepository } from '../../../../core/data-access/auth.repository';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  templateUrl: './recuperar-password.page.html',
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonInput, IonButton, IonSpinner, IonText,
  ],
})
export class RecuperarPasswordPage {
  email = '';
  loading = false;
  errorMessage = '';
  mensaje = '';

  constructor(
    private auth: AuthRepository,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ionViewWillEnter() {
    this.email = '';
    this.errorMessage = '';
    this.mensaje = '';
    this.loading = false;
    this.cdr.markForCheck();
  }

  async enviar() {
    if (this.loading) return;
    const email = (this.email || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.errorMessage = 'Ingresa un correo válido.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.mensaje = '';

    try {
      await this.auth.recuperarPassword(email);
      this.mensaje =
        'Si existe una cuenta con ese correo y el envío está habilitado, recibirás un enlace de recuperación. Revisa también la carpeta de spam.';
    } catch (error: unknown) {
      this.errorMessage = error instanceof Error
        ? error.message
        : 'No se pudo solicitar la recuperación.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  volver() {
    if (!this.loading) this.router.navigate(['/login']);
  }
}

