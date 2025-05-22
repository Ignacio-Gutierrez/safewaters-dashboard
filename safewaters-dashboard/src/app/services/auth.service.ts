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

    let logMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      logMessage = `Client-side error: ${error.error.message}`;
    } else {
      logMessage = `Server-side error. Status: ${error.status}, Message: ${error.message}`;
      if (error.error && typeof error.error.detail === 'string') {
        logMessage += `, Detail: ${error.error.detail}`;
      } else if (error.error && typeof error.error === 'object') {
        logMessage += `, Body: ${JSON.stringify(error.error)}`;
      }
    }
    console.error(logMessage);

    return throwError(() => error);
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