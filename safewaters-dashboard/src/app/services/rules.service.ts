import { Injectable } from '@angular/core';
import { catchError, throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class RulesService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  getRulesByManagedProfileId(managedProfileId: string): Observable<RuleResponse[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    });

    return this.httpClient.get<RuleResponse[]>(`${this.apiUrl}/api/rules/profile/${managedProfileId}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteRuleByManagedProfileId(ruleId: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    });
    
    return this.httpClient.delete(`${this.apiUrl}/api/rules/${ruleId}`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  createRuleByManagedProfileId(managedProfileId: string, payload: RuleRequest): Observable<RuleResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.httpClient.post<RuleResponse>(`${this.apiUrl}/api/rules/profile/${managedProfileId}`, payload, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  editRuleByManagedProfileId(ruleId: string, payload: RuleEditRequest): Observable<RuleResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.httpClient.patch<RuleResponse>(`${this.apiUrl}/api/rules/${ruleId}`, payload, { headers })
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
  active: boolean;
  id: string;
  created_at: string;
  name: string;
}

export interface RuleRequest {
  rule_type: 'URL' | 'DOMAIN' | 'KEYWORD';
  rule_value: string;
  description: string;
  active: boolean;
  name: string;
}

export interface RuleEditRequest {
  active: boolean;
}