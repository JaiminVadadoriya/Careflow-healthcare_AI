import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">Confirm</h2>
      <p class="mb-6">{{ data.message }}</p>
      <div class="flex gap-2 justify-end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="warn" (click)="onConfirm()">Delete</button>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  onConfirm() {
    this.dialogRef.close(true);
  }
  onCancel() {
    this.dialogRef.close(false);
  }
} 