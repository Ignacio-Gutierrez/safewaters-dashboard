import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  FormControl,
  FormGroupDirective,
  ReactiveFormsModule,
  NgForm,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export function hasUpperCaseValidator(control: AbstractControl): ValidationErrors | null {
  const hasUpperCase = /[A-Z]/.test(control.value);
  return hasUpperCase ? null : { hasUpperCase: true };
}

export function hasLowerCaseValidator(control: AbstractControl): ValidationErrors | null {
  const hasLowerCase = /[a-z]/.test(control.value);
  return hasLowerCase ? null : { hasLowerCase: true };
}

export function hasDigitValidator(control: AbstractControl): ValidationErrors | null {
  const hasDigit = /\d/.test(control.value);
  return hasDigit ? null : { hasDigit: true };
}

export function hasSpecialCharacterValidator(control: AbstractControl): ValidationErrors | null {
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>\-_]/.test(control.value);
  return hasSpecialCharacter ? null : { hasSpecialCharacter: true };
}

export function hasNoSpacesValidator(control: AbstractControl): ValidationErrors | null {
  const hasSpaces = /\s/.test(control.value);
  return hasSpaces ? { hasNoSpaces: true } : null;
}

@Component({
  selector: 'app-register',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    ReactiveFormsModule, FormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = signal(
    new FormGroup({
      username: new FormControl('testuser', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl('user1@example.com', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl('aStrongPassword123!', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          hasUpperCaseValidator,
          hasLowerCaseValidator,
          hasDigitValidator,
          hasSpecialCharacterValidator,
          hasNoSpacesValidator
        ]
      }),
      confirmPassword: new FormControl('aStrongPassword123!', { nonNullable: true, validators: [Validators.required] })
    })
  );

  matcher = new MyErrorStateMatcher();
  hideP = signal(true);
  hideConfP = signal(true);

  constructor(private authService: AuthService, private router: Router) { }

  clickEventP(event: MouseEvent) {
    this.hideP.set(!this.hideP());
    event.stopPropagation();
  }
  
  clickEventConfP(event: MouseEvent) {
    this.hideConfP.set(!this.hideConfP());
    event.stopPropagation();
  }

  onSubmitRegister(): void {
    const currentForm = this.registerForm();
    if (currentForm.valid) {
      const { username, email, password, confirmPassword } = currentForm.getRawValue();

      if (password !== confirmPassword) {
        currentForm.get('confirmPassword')?.setErrors({ notmatched: true });
        console.error('Las contraseñas no coinciden');
        return;
      }

      const registerRequest: RegisterRequest = { username, email, password };

      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
          this.router.navigateByUrl('/login');
        },
        error: (errorResponse) => {
          console.error('Error en el registro', errorResponse);
          if (errorResponse.error && typeof errorResponse.error.detail === 'string') {
            if (errorResponse.error.detail === "Ya existe un usuario con este email.") {
              currentForm.get('email')?.setErrors({ emailExists: true });
              currentForm.get('email')?.markAsTouched();
            } else if (errorResponse.error.detail === "Ya existe un usuario con este username.") {
              currentForm.get('username')?.setErrors({ usernameExists: true });
              currentForm.get('username')?.markAsTouched();
            } else {
              console.error('Error del servidor:', errorResponse.error.detail);
            }
          } else {
            console.error('Error de red o desconocido');
          }
        }
      });
    } else {
      currentForm.markAllAsTouched();
      console.log('Formulario no válido');
    }
  }

    navigateToLogin() {
    this.router.navigateByUrl('/login');
  }
}


export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}