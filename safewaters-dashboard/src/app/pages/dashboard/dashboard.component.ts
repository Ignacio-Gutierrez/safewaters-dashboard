import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ManagedProfilesService, ManagedProfileResponse, ManagedProfileRequest } from '../../services/managed-profiles.service';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileDialogComponent } from '../../components/profile-dialog/profile-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [
    NavbarComponent,
    MatProgressSpinnerModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  managedProfiles: ManagedProfileResponse[] = [];
  isLoading: boolean = true;
  errorLoadingProfiles: boolean = false;

  constructor(
    private managedProfilesService: ManagedProfilesService,
    private router: Router,
    public dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.loadManagedProfiles();
  }

  loadManagedProfiles(): void {
    this.isLoading = true;
    this.errorLoadingProfiles = false;
    this.managedProfilesService.getManagedProfiles().subscribe({
      next: (profilesArray: ManagedProfileResponse[]) => {
        if (Array.isArray(profilesArray)) {
          this.managedProfiles = profilesArray;
        } else {
          console.warn('Se esperaba un array de perfiles, pero se recibió otro formato.', profilesArray);
          this.managedProfiles = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading managed profiles', err);
        this.managedProfiles = [];
        this.isLoading = false;
        this.errorLoadingProfiles = true;
      }
    });
  }

  deleteProfile(id: string): void {
    if (confirm('¿Está seguro de que desea eliminar este perfil?')) {
      this.managedProfilesService.deleteManagedProfile(id).subscribe({
        next: () => {
          this.loadManagedProfiles();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error deleting profile', err);
          if (err.status === 409) {
            alert(err.error.detail || 'No se puede eliminar el perfil porque tiene historial de navegación o reglas de bloqueo asociadas.');
          } else {
            alert('Ocurrió un error al intentar eliminar el perfil. Por favor, inténtelo de nuevo.');
          }
        }
      });
    }
  }

  viewProfileDetails(id: string, profile_name: string): void {
    this.router.navigate(['/profile', id, profile_name]);
  }

  createProfile(): void {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '450px',
      disableClose: true,
      data: { isEditMode: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadManagedProfiles();
      }
    });
  }

  toggleUrlChecking(id: string, urlCheckingEnabled: boolean): void {

    this.managedProfilesService.updateUrlChecking(id, urlCheckingEnabled).subscribe({
      next: (updatedProfile) => {
        const index = this.managedProfiles.findIndex(p => p._id === id);
        if (index !== -1) {
          this.managedProfiles[index] = updatedProfile;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating profile', err);
        if (err.status === 409) {
          alert(err.error.detail || 'No se puede cambiar el estado de verificación de URL porque el perfil tiene historial de navegación o reglas de bloqueo asociadas.');
        } else {
          alert('Ocurrió un error al intentar actualizar el perfil. Por favor, inténtelo de nuevo.');
        }
        this.loadManagedProfiles();
      }
    });
  }

  copyToken(token: string): void {
    navigator.clipboard.writeText(token).then(() => {
    }).catch(err => {
      console.error('Error copying token:', err);
      this.fallbackCopyToken(token);
    });
  }

  private fallbackCopyToken(token: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = token;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }

    document.body.removeChild(textArea);
  }
}