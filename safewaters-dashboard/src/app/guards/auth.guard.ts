import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}
  
  canActivate(): boolean {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      if (this.isTokenValid(token)) {
        return true;
      } else {
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error decodificando el token:', error);
      return false;
    }
  }
}
