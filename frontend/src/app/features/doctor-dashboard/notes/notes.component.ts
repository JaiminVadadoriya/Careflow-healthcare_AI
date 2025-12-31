import { Component, OnInit, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-doctor-notes',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule
  ],
  template: `
    <div class="p-6 max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Patient Notes</h2>
      <mat-card class="mb-4" *ngFor="let note of notes; let i = index">
        <div class="flex justify-between items-center mb-2">
          <div class="font-semibold">Note #{{ i + 1 }}</div>
          <button mat-button color="primary" (click)="editNote(i)">Edit</button>
        </div>
        <div class="text-gray-700">{{ note.text }}</div>
        <div class="text-xs text-gray-400 mt-2">{{ note.date }}</div>
      </mat-card>
      <mat-card>
        <form (ngSubmit)="addOrUpdateNote()" class="flex flex-col gap-4">
          <mat-form-field >
            <mat-label>New Note</mat-label>
            <textarea matInput [(ngModel)]="noteText" name="noteText" required></textarea>
          </mat-form-field>
          <div class="flex gap-2 justify-end">
            <button mat-button type="button" (click)="resetForm()">Cancel</button>
            <button mat-raised-button color="primary" type="submit">{{ editIndex === -1 ? 'Add Note' : 'Update Note' }}</button>
          </div>
        </form>
      </mat-card>
    </div>
  `
})
export class NotesComponent implements OnInit {
  @Input() patientId!: string;
  notes: any[] = [];
  noteText = '';
  editIndex = -1;
  loading = false;
  error = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    if (this.patientId) {
      this.loadNotes();
    }
  }

  loadNotes() {
    this.loading = true;
    this.error = '';
    this.doctorService.getPatientDetails(this.patientId).subscribe({
      next: (res: any) => {
        this.notes = res.data?.notes || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load notes';
        this.loading = false;
      }
    });
  }

  addOrUpdateNote() {
    if (this.editIndex === -1) {
      this.loading = true;
      this.doctorService.addNoteToPatient(this.patientId, { text: this.noteText }).subscribe({
        next: (res: any) => {
          this.notes.unshift(res.data);
          this.noteText = '';
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      // For edit, you may need a separate endpoint
      this.notes[this.editIndex].text = this.noteText;
      this.editIndex = -1;
      this.noteText = '';
    }
  }

  editNote(i: number) {
    this.noteText = this.notes[i].text;
    this.editIndex = i;
  }

  resetForm() {
    this.noteText = '';
    this.editIndex = -1;
  }
} 