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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
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
  selector: 'app-password-reset-confirm',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    ReactiveFormsModule, FormsModule, MatProgressSpinnerModule
  ],
  templateUrl: './password-reset-confirm.component.html',
  styleUrl: './password-reset-confirm.component.css'
})
export class PasswordResetConfirmComponent {
  emailForm = signal(
    new FormGroup({
      password: new FormControl('', {
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
      confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    })
  );

  matcher = new MyErrorStateMatcher();
  hideP = signal(true);
  hideConfP = signal(true);
  loading = signal(false);

  constructor(private authService: AuthService, private router: Router) { }

  clickEventP(event: MouseEvent) {
    this.hideP.set(!this.hideP());
    event.stopPropagation();
  }
  
  clickEventConfP(event: MouseEvent) {
    this.hideConfP.set(!this.hideConfP());
    event.stopPropagation();
  }


  onSubmitNewPassword(): void {
    if (this.emailForm().valid) {
      this.loading.set(true);
      const password = this.emailForm().get('password')?.value;
      const confirmPassword = this.emailForm().get('confirmPassword')?.value;

      if (password === confirmPassword) {
        const urlTree = this.router.parseUrl(this.router.url);
        const token = urlTree.queryParams['token'];

        this.authService.resetPassword(token!, password!).subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigateByUrl('/login');
          },
          error: (error) => {
            this.loading.set(false);
            console.error('Error resetting password:', error);
          }
        });
      } else {
        this.loading.set(false);
        console.error('Passwords do not match');
      }
    } else {
      this.loading.set(false);
      console.error('Form is invalid');
    }
  }
}