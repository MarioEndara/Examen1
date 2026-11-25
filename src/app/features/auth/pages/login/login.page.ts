import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Importamos los componentes de Ionic individualmente (Adiós IonicModule)
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonLabel, IonInput, IonButton, IonSpinner, IonText 
} from '@ionic/angular';

// Ruta relativa correcta (4 niveles arriba)
import { SupabaseService } from '../../../../core/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, 
    IonItem, IonLabel, IonInput, IonButton, IonSpinner, IonText
  ]
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, ingresa tu correo y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
      email: this.email,
      password: this.password
    });

    this.loading = false;

    if (error) {
      this.errorMessage = 'Credenciales incorrectas: ' + error.message;
      console.error(error);
    } else {
      console.log('Login exitoso:', data.user);
      this.router.navigate(['/home']); 
    }
  }
}