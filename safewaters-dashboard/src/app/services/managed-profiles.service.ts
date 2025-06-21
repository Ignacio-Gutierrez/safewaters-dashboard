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

  deleteManagedProfile(id: string): Observable<any> {
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

  editManagedProfile(id: string, payload: ManagedProfileRequest): Observable<ManagedProfileResponse> {
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

  updateUrlChecking(id: string, urlCheckingEnabled: boolean): Observable<ManagedProfileResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });

    const payload = { url_checking_enabled: urlCheckingEnabled };

    return this.httpClient.patch<ManagedProfileResponse>(`${this.apiUrl}/api/managed_profiles/${id}`, payload, { headers })
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
  name: string;
  _id: string;
  token: string;
  created_at: string;
  manager_user_id: string;
  blocking_rules_count: number;
  url_checking_enabled: boolean;
}

export interface ManagedProfileRequest {
  name: string;
}