import { Injectable } from '@angular/core';
import { catchError, throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = '/api';

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.httpClient.post<RegisterResponse>(`${this.apiUrl}/api/auth/register`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('username', credentials.username || credentials.email || '')
      .set('password', credentials.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.httpClient.post<LoginResponse>(
      `${this.apiUrl}/api/auth/login`,
      body.toString(),
      { headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => {
      return errorMessage;
    }
    );
  }
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface RegisterResponse {
  email: string;
  username: string;
  id: string;
  created_at: string;
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}