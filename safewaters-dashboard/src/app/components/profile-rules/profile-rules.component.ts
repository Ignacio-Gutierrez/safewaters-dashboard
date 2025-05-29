import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RulesService, RuleResponse } from '../../services/rules.service';
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
  managedProfileId: number = NaN;

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
      this.managedProfileId = Number(idString);
    }
    if (isNaN(this.managedProfileId)) {
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

  deleteProfileRule(ruleId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta regla?')) {
      this.rulesService.deleteRuleByManagedProfileId(ruleId).subscribe({
        next: () => {
          console.log('Rule deleted successfully');
          this.loadProfileRules();
        },
        error: (err) => {
          console.error('Error deleting rule', err);
          alert('Error al eliminar la regla.' + err.message);
        }
      });
    }
  }

  createRule(): void {
    const dialogRef = this.dialog.open(RulesDialogComponent, {
      width: '450px',
      height: '420px',
      disableClose: true,
      data: { managedProfileId: this.managedProfileId }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        console.log('Rule created:', result);
        this.loadProfileRules();
      }
    });
  }
}
