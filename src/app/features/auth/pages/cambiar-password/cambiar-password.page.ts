import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonButton, IonSpinner, IonText,
} from '@ionic/angular';
import { AuthRepository } from '../../../../core/data-access/auth.repository';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  templateUrl: './cambiar-password.page.html',
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonInput, IonButton, IonSpinner, IonText,
  ],
})
export class CambiarPasswordPage {
  nuevaPassword = '';
  confirmarPassword = '';
  loading = false;
  errorMessage = '';

  constructor(
    private auth: AuthRepository,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ionViewWillEnter() {
    this.nuevaPassword = '';
    this.confirmarPassword = '';
    this.errorMessage = '';
    this.loading = false;
    this.cdr.markForCheck();
  }

  async guardar() {
    if (this.loading) return;
    const nueva = this.nuevaPassword || '';
    const confirmacion = this.confirmarPassword || '';
    if (!nueva.trim() || nueva.length < 8 || nueva.length > 128) {
      this.errorMessage = 'La contraseña debe tener entre 8 y 128 caracteres.';
      return;
    }
    if (nueva === 'Ecuador2026') {
      this.errorMessage = 'Elige una contraseña personal diferente de Ecuador2026.';
      return;
    }
    if (nueva !== confirmacion) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      await this.auth.cambiarPassword(nueva);
      this.nuevaPassword = '';
      this.confirmarPassword = '';
      await this.router.navigate(['/login'], {
        replaceUrl: true,
        state: { mensaje: 'Contraseña actualizada. Ingresa con tu nueva contraseña.' },
      });
    } catch (error: unknown) {
      this.errorMessage = error instanceof Error
        ? error.message
        : 'No se pudo actualizar la contraseña.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  async salir() {
    if (this.loading) return;
    this.loading = true;
    this.errorMessage = '';
    try {
      await this.auth.logout();
      await this.router.navigate(['/login'], { replaceUrl: true });
    } catch (error: unknown) {
      this.errorMessage = error instanceof Error ? error.message : 'No se pudo cerrar la sesión.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }
}

