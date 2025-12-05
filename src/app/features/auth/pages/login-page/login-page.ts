import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/firebase/auth.service';
import { from, of } from 'rxjs';
import { FormUtils } from '../../../../shared/utils/form-utils/form-utils';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPage {
async loginWithGoogle() {
  if (this.googleLoading()) return; // evita spam

  this.googleLoading.set(true);
  this.googleError.set('');

  try {
    await this.authService.loginWithGoogle().toPromise();
    this.router.navigate(['/home']);
  } catch (err) {
    console.error(err);
    this.googleError.set("Error al iniciar sesión con Google");
  } finally {
    this.googleLoading.set(false);
  }
}

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  formUtils = inject(FormUtils);
   googleLoading = signal(false);
  googleError = signal('');

  loginForm: FormGroup;

  // Signal para disparar el login
  private loginTrigger = signal<{ email: string; password: string } | null>(null);

  // rxResource para manejar el proceso de login (Angular 20+)
  loginResource = rxResource({
    params: () => this.loginTrigger(),
    stream: ({ params }) => {
      if (!params) return of(null);

      // Convertimos la Promise de Firebase a Observable AQUÍ (no en el service)
      return from(this.authService.login(params.email, params.password));
    }
  });

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Effect para navegar cuando el login sea exitoso
    effect(() => {
      if (this.loginResource.hasValue() && this.loginResource.value()) {
        console.log('Login exitoso, navegando a /simpsons');
        this.router.navigate(['/simpsons']);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    // Disparar el login actualizando el signal
    this.loginTrigger.set({ email, password });
  }

  // Computed signal para el estado de carga
  loading = this.loginResource.isLoading;

  // Computed signal para el mensaje de error
  errorMessage = () => {
    const error = this.loginResource.error();
    if (!error) return '';

    const code = (error as any).code || '';
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/user-disabled': 'El usuario ha sido deshabilitado',
      'auth/user-not-found': 'No existe un usuario con este correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Credenciales inválidas'
    };
    return errorMessages[code] || 'Error al iniciar sesión';
  };

  // Getters para validación en el template
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
