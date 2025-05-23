import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ManagedProfilesService, ManagedProfileResponse } from '../../services/managed-profiles.service';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateProfileDialogComponent } from '../../components/create-profile-dialog/create-profile-dialog.component'; // Importar el componente de diálogo

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


  editProfile(profileId: number): void {
    const profileToEdit = this.managedProfiles.find(p => p.id === profileId);
    if (!profileToEdit) {
      console.error('Profile not found for editing');
      return;
    }

    const dialogRef = this.dialog.open(CreateProfileDialogComponent, {
      width: '450px',
      disableClose: true,
      data: { isEditMode: true, profile: profileToEdit }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        console.log('Profile updated:', result);
        this.loadManagedProfiles();
      }
    });
  }

  deleteProfile(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este perfil?')) {
      this.managedProfilesService.deleteManagedProfile(id).subscribe({
        next: () => {
          console.log('Profile deleted successfully');
          this.loadManagedProfiles();
        },
        error: (err) => {
          console.error('Error deleting profile', err);
        }
      });
    }
  }

  viewProfileDetails(id: number, profile_name: string): void {
    console.log('Attempting to view profile with id:', id);
    this.router.navigate(['/profile', id, profile_name]);
  }

  createProfile(): void {
    const dialogRef = this.dialog.open(CreateProfileDialogComponent, {
      width: '450px',
      disableClose: true,
      data: { isEditMode: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        console.log('Profile created:', result);
        this.loadManagedProfiles();
      }
    });
  }
}