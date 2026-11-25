import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonLabel, IonInput, IonButton, IonSpinner, IonText 
} from '@ionic/angular';
import { AuthRepository } from '../../../../core/data-access/auth.repository';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonItem, IonLabel, IonInput, IonButton, IonSpinner, IonText
  ]
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  // Inyectamos el Repositorio, ya no el SupabaseService directo
  constructor(
    private authRepo: AuthRepository,
    private router: Router
  ) {}

  async onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, ingresa tu correo y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const { data, error } = await this.authRepo.login(this.email, this.password);

      if (error) {
        this.errorMessage = 'Error: ' + error.message;
      } else {
        console.log('Login exitoso:', data.user);
        this.router.navigate(['/home']); 
      }
    } catch (err: any) {
      this.errorMessage = 'Error de conexión: ' + err.message;
    } finally {
      this.loading = false;
    }
  }
}