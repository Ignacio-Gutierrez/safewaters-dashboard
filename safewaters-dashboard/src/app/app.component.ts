import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, MatIconModule, MatTooltipModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'safewaters-dashboard';
  showFab = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateFabVisibility(event.url);
      });

    this.updateFabVisibility(this.router.url);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  private updateFabVisibility(url: string): void {
    const hideFabRoutes = ['/dashboard', '/login', '/register', '/'];
    const isOnHiddenRoute = hideFabRoutes.some(route => 
      url === route || (route === '/dashboard' && url === '/')
    );
    
    this.showFab = !isOnHiddenRoute;
  }

  shouldShowFab(): boolean {
    return this.showFab;
  }
}