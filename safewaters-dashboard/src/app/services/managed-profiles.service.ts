import { Injectable } from '@angular/core';
import { catchError, throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ManagedProfilesService {
  private readonly apiUrl = '/api';

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  getManagedProfiles(): Observable<ManagedProfileResponse[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    });

    return this.httpClient.get<ManagedProfileResponse[]>(`${this.apiUrl}/api/managed_profiles/`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteManagedProfile(id: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    });

    return this.httpClient.delete(`${this.apiUrl}/api/managed_profiles/${id}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  createManagedProfile(payload: ManagedProfileRequest): Observable<ManagedProfileResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.httpClient.post<ManagedProfileResponse>(`${this.apiUrl}/api/managed_profiles/`, payload, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  editManagedProfile(id: number, payload: ManagedProfileRequest): Observable<ManagedProfileResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.httpClient.put<ManagedProfileResponse>(`${this.apiUrl}/api/managed_profiles/${id}`, payload, { headers })
      .pipe(
        catchError(this.handleError)
      );
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
    if (error.status === 401 || error.status === 403) {
      this.router.navigate(['/login']);
    }
    return throwError(() => error);
  }
}


export interface ManagedProfileResponse {
  profile_name: string;
  link_status: string;
  last_extension_communication: string;
  id: number;
  manager_user_id: number;
  created_at: string;
  link_code: string;
  extension_instance_id: string | null;
}

export interface ManagedProfileRequest {
  profile_name: string;
  // link_status y last_extension_communication son opcionales aquí
  // si el backend los maneja por defecto o los establece.
  // Si necesitas enviarlos explícitamente desde el frontend, añádelos.
  // link_status?: string; 
  // last_extension_communication?: string; // O Date, dependiendo de cómo lo manejes
}