import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileManagementComponent } from './pages/profile-management/profile-management.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: '/dashboard', 
        pathMatch: 'full' 
    },
    { 
        path: 'login', 
        component: LoginComponent,
        canActivate: [GuestGuard]
    },
    { 
        path: 'register', 
        component: RegisterComponent,
        canActivate: [GuestGuard]
    },
    { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: 'profile/:id/:name', 
        component: ProfileManagementComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: '**', 
        redirectTo: '/dashboard' 
    }
];
