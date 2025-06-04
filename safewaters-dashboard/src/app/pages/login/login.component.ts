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
  selector: 'app-login',
  imports: [MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule,
    ReactiveFormsModule, FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = signal(
    new FormGroup({
      usernameOrEmail: new FormControl('user12@example.com', { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl('aStrongPassword123!', { nonNullable: true, validators: [Validators.required] })
    })
  );

  loginError = signal<string | null>(null);


  matcher = new MyErrorStateMatcher();
  hide = signal(true);

  constructor(private authService: AuthService, private router: Router) { }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }



  onSubmit(): void {
    this.loginError.set(null);
    if (this.loginForm().valid) {
      const { usernameOrEmail, password } = this.loginForm().value;
      let credentials: LoginRequest = { password: password! };

      if (usernameOrEmail!.includes('@')) {
        credentials.email = usernameOrEmail;
      } else {
        credentials.username = usernameOrEmail;
      }

      this.authService.login(credentials).subscribe({
        next: (response) => {
          localStorage.setItem('access_token', response.access_token);
          this.router.navigate(['/dashboard']);
          console.log('Login exitoso:', response);
        },
        error: (err) => {
          console.error('Error en login:', err);
          if (err.status === 401) {
            this.loginError.set('Credencial icorrecta.');
          } else {
            this.loginError.set('Ocurrió un error. Por favor, inténtalo de nuevo.');
          }
        },
      });
    } else {
      console.error('Formulario inválido');
    }
  }

  navigateToRegister() {
    this.router.navigateByUrl('/register');
  }

}
export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}