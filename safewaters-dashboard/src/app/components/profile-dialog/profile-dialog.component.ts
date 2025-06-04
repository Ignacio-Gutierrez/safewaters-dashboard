import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ManagedProfilesService, ManagedProfileRequest, ManagedProfileResponse } from '../../services/managed-profiles.service';


@Component({
  selector: 'app-profile-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './profile-dialog.component.html',
  styleUrl: './profile-dialog.component.css'
})
export class ProfileDialogComponent {
  createProfileForm: FormGroup;
  isSaving: boolean = false;
  dialogTitle: string;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateProfileDialogData,
    private managedProfilesService: ManagedProfilesService
  ) {
    this.isEditMode = data.isEditMode;
    this.dialogTitle = this.isEditMode ? 'Editar Perfil' : 'Crear Nuevo Perfil';

    this.createProfileForm = this.fb.group({
      profileName: [
        this.isEditMode && data.profile ? data.profile.name : '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
      ]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.createProfileForm.invalid || this.isSaving) {
      this.createProfileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload: ManagedProfileRequest = {
      name: this.createProfileForm.value.profileName
    };

    if (this.isEditMode && this.data.profile) {
      this.managedProfilesService.editManagedProfile(this.data.profile._id, payload).subscribe({
        next: (updatedProfile) => {
          this.isSaving = false;
          this.dialogRef.close(updatedProfile);
        },
        error: (errorResponse) => {
          this.isSaving = false;
          console.error('Error updating profile:', errorResponse);
          if (errorResponse.error && typeof errorResponse.error.detail === 'string') {
            if (errorResponse.error.detail === "Ya existe un perfil con este nombre para este usuario.") {
              this.createProfileForm.get('profileName')?.setErrors({ profileNameExists: true });
              this.createProfileForm.get('profileName')?.markAsTouched();
            } else {
              console.error('Error del servidor:', errorResponse.error.detail);
            }
          } else {
            console.error('Error de red o desconocido');
          }
        }
      });
    } else {
      this.managedProfilesService.createManagedProfile(payload).subscribe({
        next: (newProfile) => {
          this.isSaving = false;
          this.dialogRef.close(newProfile);
        },
        error: (errorResponse) => {
          this.isSaving = false;
          console.error('Error creating profile:', errorResponse);
          if (errorResponse.error && typeof errorResponse.error.detail === 'string') {
            if (errorResponse.error.detail === "Ya existe un perfil con este nombre para este usuario.") {
              this.createProfileForm.get('profileName')?.setErrors({ profileNameExists: true });
              this.createProfileForm.get('profileName')?.markAsTouched();
            } else {
              console.error('Error del servidor:', errorResponse.error.detail);
            }
          } else {
            console.error('Error de red o desconocido');
          }
        }
      });
    }
  }
}

export interface CreateProfileDialogData {
  isEditMode: boolean;
  profile?: ManagedProfileResponse;
}