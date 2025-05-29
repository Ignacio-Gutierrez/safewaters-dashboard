import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIcon } from '@angular/material/icon';

import { RulesService, RuleRequest, RuleResponse } from '../../services/rules.service';



@Component({
  selector: 'app-rules-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatIcon
  ],
  templateUrl: './rules-dialog.component.html',
  styleUrl: './rules-dialog.component.css'
})
export class RulesDialogComponent {
  createRuleForm: FormGroup;
  isSaving: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RulesDialogComponent>,
    private rulesService: RulesService,
    @Inject(MAT_DIALOG_DATA) public data: { managedProfileId: number }
  ) {
    this.createRuleForm = this.fb.group({
      rule_type: ['', Validators.required],
      rule_value: ['', Validators.required, Validators.maxLength(255)],
      description: ['', Validators.required, Validators.maxLength(255)],
      is_active: [true, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.createRuleForm.invalid || this.isSaving) {
      this.createRuleForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload: RuleRequest = {
      rule_type: this.createRuleForm.value.rule_type,
      rule_value: this.createRuleForm.value.rule_value,
      description: this.createRuleForm.value.description,
      is_active: this.createRuleForm.value.is_active
    };

    this.rulesService.createRule(this.data.managedProfileId, payload).subscribe({
      next: (response: RuleResponse) => {
        console.log('Rule created successfully:', response);
        this.isSaving = false;
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Error creating rule:', error);
        this.isSaving = false;
      }
    });
  }
}