import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,

} from '@angular/forms';
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
    @Inject(MAT_DIALOG_DATA) public data: { managedProfileId: string }
  ) {
    this.createRuleForm = this.fb.group({
      rule_type: ['', Validators.required],
      rule_value: ['', [Validators.required, Validators.maxLength(255), this.validateRuleValue.bind(this)]],
      description: ['', Validators.maxLength(255)],
      active: [true]
    });

    this.createRuleForm.get('rule_type')?.valueChanges.subscribe(() => {
      this.createRuleForm.get('rule_value')?.updateValueAndValidity();
    });
  }

  validateRuleValue(control: any) {
    const ruleType = this.createRuleForm?.get('rule_type')?.value;
    const ruleValue = control.value;

    if (!ruleType || !ruleValue) {
      return null;
    }

    switch (ruleType) {
      case 'URL':
        // Validar URL completa
        const urlPattern = /^https?:\/\/.+/;
        return urlPattern.test(ruleValue) ? null : { invalidUrl: true };

      case 'DOMAIN':
        // Validar formato de dominio
        const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*$/;
        return domainPattern.test(ruleValue) ? null : { invalidDomain: true };

      case 'KEYWORD':
        // Validar que no esté vacío y no contenga caracteres especiales de URL
        const keywordPattern = /^[a-zA-Z0-9\-_]+$/;
        return keywordPattern.test(ruleValue) ? null : { invalidKeyword: true };

      default:
        return null;
    }
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
      active: this.createRuleForm.value.active
    };

    this.rulesService.createRuleByManagedProfileId(this.data.managedProfileId, payload).subscribe({
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