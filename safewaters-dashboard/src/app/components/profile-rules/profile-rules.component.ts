import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { RulesService, RuleResponse, RuleEditRequest } from '../../services/rules.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RulesDialogComponent } from '../rules-dialog/rules-dialog.component';

@Component({
  selector: 'app-profile-rules',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile-rules.component.html',
  styleUrl: './profile-rules.component.css'
})
export class ProfileRulesComponent implements OnInit {

  managedProfilesRules: RuleResponse[] = [];
  isLoading: boolean = true;
  errorLoadingRules: boolean = false;
  managedProfileId: string = '';

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private rulesService: RulesService
  ) { }


  ngOnInit(): void {
    this.loadProfileRules();
  }

  loadProfileRules(): void {
    this.isLoading = true;
    this.errorLoadingRules = false;
    const urlPath = this.router.url;
    const pathSegments = urlPath.split('/');
    const profileKeywordIndex = pathSegments.indexOf('profile');

    if (profileKeywordIndex !== -1 && pathSegments.length > profileKeywordIndex + 1) {
      const idString = pathSegments[profileKeywordIndex + 1];
      this.managedProfileId = String(idString);
    }
    if (!this.managedProfileId) {
      console.error('Invalid or missing profile ID in URL:', this.router.url);
      this.errorLoadingRules = true;
      this.isLoading = false;
      return;
    }
    this.rulesService.getRulesByManagedProfileId(this.managedProfileId).subscribe({
      next: (rulesArray: RuleResponse[]) => {
        if (Array.isArray(rulesArray)) {
          this.managedProfilesRules = rulesArray;
        } else {
          console.warn('Se esperaba un array de reglas, pero se recibió otro formato.', rulesArray);
          this.managedProfilesRules = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile rules', err);
        this.managedProfilesRules = [];
        this.isLoading = false;
        this.errorLoadingRules = true;
      }
    });
  }

  deleteProfileRule(ruleId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta regla?')) {
      this.rulesService.deleteRuleByManagedProfileId(ruleId).subscribe({
        next: () => {
          this.loadProfileRules();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error deleting rule', err);
          if (err.status === 409) {
            alert(err.error?.detail || 'No se puede eliminar la regla porque está asociada a entradas del historial de navegación.');
          } else {
            alert('Ocurrió un error al intentar eliminar la regla. Por favor, inténtelo de nuevo.');
          }
        }
      });
    }
  }

  createRule(): void {
    const dialogRef = this.dialog.open(RulesDialogComponent, {
      width: '450px',
      height: '500px',
      disableClose: true,
      data: { managedProfileId: this.managedProfileId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProfileRules();
      }
    });
  }


  toggleRuleStatus(rule: boolean, rule_id: string): void {
    const newStatus = !rule;

    const payload: RuleEditRequest = {
      active: newStatus
    };

    this.rulesService.editRuleByManagedProfileId(rule_id, payload).subscribe({
      next: (updatedRule) => {
        const index = this.managedProfilesRules.findIndex(r => r.id === updatedRule.id);
        if (index !== -1) {
          this.managedProfilesRules[index] = updatedRule;
        }
      },
      error: (error) => {
        console.error('Error al actualizar el estado de la regla:', error);
        this.loadProfileRules(); 
      }
    });
  }

}
