import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-rule-details-dialog',
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule
    ],
    templateUrl: './rule-details-dialog.component.html',
    styleUrl: './rule-details-dialog.component.css'
})
export class RuleDetailsDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<RuleDetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: RuleDetailsData
    ) { }

    close(): void {
        this.dialogRef.close();
    }
}

export interface RuleDetailsData {
    blocking_rule_name: string;
    blocking_rule_description: string;
    blocking_rule_enabled: boolean;
    visited_url: string;
    visited_at: string;
}