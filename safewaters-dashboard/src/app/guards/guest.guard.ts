import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  
  constructor(private router: Router) {}
  
  canActivate(): boolean {
    const token = localStorage.getItem('access_token');
    
    if (token && this.isTokenValid(token)) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    
    return true;
  }
  
  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
}
