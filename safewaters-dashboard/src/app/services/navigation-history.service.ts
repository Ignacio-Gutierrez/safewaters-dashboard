import { Injectable } from '@angular/core';
import { catchError, throwError, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class NavigationHistoryService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  getNavigationHistory(managedProfileId: string, page: number = 1, pageSize: number = 10, blocked: boolean): Observable<PaginatedHistoryResponse> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    });

    const endpoint = environment.production 
      ? `${this.apiUrl}/navigation-history/profile/${managedProfileId}?page=${page}&page_size=${pageSize}&blocked_only=${blocked}`
      : `${this.apiUrl}/api/navigation-history/profile/${managedProfileId}?page=${page}&page_size=${pageSize}&blocked_only=${blocked}`;
    
    return this.httpClient.get<PaginatedHistoryResponse>(endpoint, { headers })
      .pipe(
        catchError(this.handleError.bind(this))
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

export interface NavigationHistoryResponse {
  id: string;
  visited_url: string;
  blocked: boolean;
  visited_at: string;
  
  // Datos del perfil (desnormalizados)
  profile_id: string;
  profile_name: string;
  
  // Datos del usuario (desnormalizados)
  user_id: string;
  user_email: string;
  user_username: string | null;
  
  // Datos de la regla de bloqueo (si hay)
  blocking_rule_id: string | null;
  blocking_rule_name: string | null;
  blocking_rule_type: string | null;
  blocking_rule_value: string | null;
  blocking_rule_description: string | null;
}

export interface PaginatedHistoryResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  items: NavigationHistoryResponse[];
}



