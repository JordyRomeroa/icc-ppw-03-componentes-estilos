import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { from, of } from 'rxjs';
import { AuthService } from '../../../../core/services/firebase/auth.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormUtils } from '../../../../shared/utils/form-utils/form-utils';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css']
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;

  private registerTrigger = signal<{ email: string; password: string } | null>(null);

  registerResource = rxResource({
    params: () => this.registerTrigger(),
    stream: ({ params }) => {
      if (!params) return of(null);
      // Convertir Promise → Observable
      return from(this.authService.register(params.email, params.password));
    }
  });

  formUtils = inject(FormUtils);

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });

    effect(() => {
      if (this.registerResource.hasValue() && this.registerResource.value()) {
        console.log('Registro exitoso, navegando a /simpsons');
        this.router.navigate(['/simpsons']);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.registerForm.value;

    this.registerTrigger.set({ email, password });
  }

  loading = this.registerResource.isLoading;

  errorMessage = () => {
    const error = this.registerResource.error();
    if (!error) return '';

    const code = (error as any).code || '';
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña es muy débil'
    };
    return errorMessages[code] || 'Error al registrar usuario';
  }

  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  get passwordMismatch() {
  return this.registerForm.hasError('passwordMismatch');
}

}
