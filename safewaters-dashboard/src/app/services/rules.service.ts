import { Injectable } from '@angular/core';
import { catchError, throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class RulesService {
  private readonly apiUrl = '/api';

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  getRulesByManagedProfileId(managedProfileId: number): Observable<RuleResponse[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    });

    return this.httpClient.get<RuleResponse[]>(`${this.apiUrl}/api/managed-profiles/${managedProfileId}/blocking-rules/`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteRule(ruleId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    });
    return this.httpClient.delete(`${this.apiUrl}/api/blocking-rules/${ruleId}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  createRule(managedProfileId: number, payload: RuleRequest): Observable<RuleResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.httpClient.post<RuleResponse>(`${this.apiUrl}/api/managed_profiles/${managedProfileId}/blocking-rules/`, payload, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }


  editRule(ruleId: number, payload: RuleRequest): Observable<RuleResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.httpClient.put<RuleResponse>(`${this.apiUrl}/api/blocking-rules/${ruleId}`, payload, { headers })
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
      localStorage.removeItem('access_token');
    }
    return throwError(() => error);
  }
}


export interface RuleResponse {
  rule_type: string;
  rule_value: string;
  description: string;
  is_active: boolean;
  id: number;
  managed_profile_id: number;
  created_at: string;
}

export interface RuleRequest {
  rule_type: 'URL_EXACTA' | 'DOMINIO' | 'PALABRA_CLAVE_URL';
  rule_value: string;
  description: string;
  is_active: boolean;
}