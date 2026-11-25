import { ChangeDetectorRef, Component } from '@angular/core';
import type { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonButton, IonSpinner, IonText,
} from '@ionic/angular';
import { AuthRepository } from '../../../../core/data-access/auth.repository';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonInput, IonButton, IonSpinner, IonText,
  ],
})
export class LoginPage implements OnInit {
  cedula = '';
  password = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private auth: AuthRepository,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.mostrarEstadoNavegacion();
  }

  ionViewWillEnter() {
    this.mostrarEstadoNavegacion();
  }

  private mostrarEstadoNavegacion() {
    this.password = '';
    this.loading = false;
    this.errorMessage = '';
    this.successMessage = '';
    const mensaje: unknown = history.state?.mensaje;
    if (typeof mensaje === 'string') this.successMessage = mensaje;
    if (this.route.snapshot.queryParamMap.has('sesion')) {
      this.errorMessage =
        'Inicia sesión para continuar. Si tu enlace venció, solicita uno nuevo.';
    }
    this.cdr.markForCheck();
  }

  async onLogin() {
    if (this.loading) return;
    const cedula = (this.cedula || '').trim();
    if (!/^\d{10}$/.test(cedula) || !this.password) {
      this.errorMessage = 'Ingresa tu cédula de 10 dígitos y tu contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const perfil = await this.auth.login(cedula, this.password);
      this.password = '';
      await this.router.navigate([
        perfil.debe_cambiar_password ? '/cambiar-password' : '/home',
      ], { replaceUrl: true });
    } catch (error: unknown) {
      this.errorMessage = error instanceof Error
        ? error.message
        : 'No se pudo iniciar sesión.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  irARecuperar() {
    if (!this.loading) this.router.navigate(['/recuperar-password']);
  }
}

