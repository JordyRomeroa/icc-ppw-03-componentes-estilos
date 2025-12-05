import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtils {
  getFieldError(form: FormGroup, field: string): string | null {
    const control = form.get(field);

    if (!control || !control.errors || !control.touched) {
      return null;
    }

    const errors = control.errors;

    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['email']) return 'Ingresa un correo válido';
    if (errors['minlength'])
      return `Debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength'])
      return `Debe tener máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['pattern']) return 'Formato inválido';

    return 'Campo inválido';
  }
}
