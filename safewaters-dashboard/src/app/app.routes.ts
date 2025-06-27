import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileManagementComponent } from './pages/profile-management/profile-management.component';
import { PasswordResetConfirmComponent } from './pages/password-reset-confirm/password-reset-confirm.component'; 
import { PasswordResetRequestComponent } from './pages/password-reset-request/password-reset-request.component';
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
        path: 'password-reset-request',
        component: PasswordResetRequestComponent,
    },
    {
        path: 'reset-password',
        component: PasswordResetConfirmComponent,
    },
    { 
        path: '**', 
        redirectTo: '/dashboard' 
    }
];
