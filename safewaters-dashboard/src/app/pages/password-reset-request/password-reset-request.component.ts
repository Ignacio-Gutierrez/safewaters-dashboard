import { Component, signal } from '@angular/core';
import {
  FormGroup,
  FormsModule,
  FormControl,
  FormGroupDirective,
  ReactiveFormsModule,
  NgForm,
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

@Component({
  selector: 'app-password-reset-request',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    ReactiveFormsModule, FormsModule, MatProgressSpinnerModule
  ],
  templateUrl: './password-reset-request.component.html',
  styleUrl: './password-reset-request.component.css'
})
export class PasswordResetRequestComponent {
  emailForm = signal(
    new FormGroup({
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    })
  );

  loginError = signal<string | null>(null);
  loading = false;
  successMessage = '';

  matcher = new MyErrorStateMatcher();
  hide = signal(true);

  constructor(private authService: AuthService, private router: Router) { }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }



  onSubmit(): void {
    if (this.emailForm().valid) {
      this.loading = true;
      this.successMessage = '';
      const email = this.emailForm().get('email')?.value || '';

      this.authService.requestPasswordReset(email).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.';
        },
        error: (error) => {
          this.loading = false;
          console.error(error.error.message || 'Error al enviar la solicitud de restablecimiento de contraseña');
        }
      });
    } else {
      this.loginError.update(() => 'Por favor, ingresa un correo electrónico válido');
    }
  }

  navigateToLogin() {
    this.router.navigateByUrl('/login');
  }

}