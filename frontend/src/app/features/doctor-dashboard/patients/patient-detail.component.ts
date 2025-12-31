import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatCardModule, MatButtonModule, MatIconModule, FormsModule],
  template: `
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-2">Patient Details</h2>
      <mat-card class="mb-4">
        <div class="flex flex-col gap-2">
          <div><span class="font-semibold">Name:</span> {{ data.full_name }}</div>
          <div><span class="font-semibold">DOB:</span> {{ data.dob }}</div>
          <div><span class="font-semibold">ID:</span> {{ data._id }}</div>
        </div>
      </mat-card>
      <mat-card class="mb-4">
        <h3 class="font-semibold mb-2">Medical History</h3>
        <ul class="list-disc pl-6">
          <li *ngFor="let record of medicalHistory">{{ record }}</li>
        </ul>
      </mat-card>
      <mat-card>
        <h3 class="font-semibold mb-2">Doctor's Notes</h3>
        <textarea class="w-full border rounded p-2 mb-2" rows="3" [(ngModel)]="note"></textarea>
        <button mat-raised-button color="primary" (click)="saveNote()">Save Note</button>
      </mat-card>
    </div>
  `
})
export class PatientDetailComponent {
  medicalHistory = [
    'Diabetes - 2015',
    'Hypertension - 2018',
    'Surgery - 2020'
  ]; // Replace with real data
  note = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  saveNote() {
    // TODO: Integrate with backend
    alert('Note saved!');
  }
} 