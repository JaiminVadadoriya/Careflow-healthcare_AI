import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-doctor-notes',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Clinical Notes</h2>
    
      <!-- Patient Selector (if no input) -->
      @if (!patientId) {
        <div class="mb-8">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Patient</label>
            <select 
                [(ngModel)]="selectedPatientId" 
                (change)="onPatientSelect()"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                <option value="" disabled selected>Choose a patient...</option>
                @for (patient of assignedPatients; track patient._id) {
                    <option [value]="patient._id">{{ patient.full_name }} (ID: {{ patient._id }})</option>
                }
            </select>
        </div>
      }

      <!-- Add/Edit Note Form -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{{ editIndex === -1 ? 'Add New Note' : 'Edit Note' }}</h3>
        <form (ngSubmit)="addOrUpdateNote()">
          <div class="mb-4">
            <textarea
              [(ngModel)]="noteText"
              name="noteText"
              required
              rows="4"
              [disabled]="!getActivePatientId()"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter clinical notes, observations, or updates..."
            ></textarea>
          </div>
    
          <div class="flex justify-end gap-3">
            @if (noteText) {
              <button type="button" (click)="resetForm()" class="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-transparent font-medium">Clear</button>
            }
            <button type="submit" [disabled]="!noteText.trim() || loading || !getActivePatientId()" class="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              @if (!loading) {
                <span class="material-icons text-sm">save</span>
              }
              @if (loading) {
                <span class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              }
              {{ editIndex === -1 ? 'Save Note' : 'Update Note' }}
            </button>
          </div>
        </form>
      </div>
    
      <!-- Notes List -->
      <div class="space-y-4">
        @if (loading && notes.length === 0) {
          <div class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }
    
        @for (note of notes; track note; let i = $index) {
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow relative group">
            <!-- Header -->
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
                  {{ i + 1 }}
                </div>
                <span class="text-xs text-gray-400 font-medium">{{ (note.date || note.createdAt) | date:'medium' }}</span>
              </div>
              <!-- 
              <button (click)="editNote(i)" class="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <span class="material-icons text-[20px]">edit</span>
              </button>
              -->
            </div>
            <!-- Content -->
            <div class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap pl-10">
                {{ getNoteText(note) }}
            </div>
          </div>
        }
    
        <!-- Empty State -->
        @if (!loading && notes.length === 0) {
          <div class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <span class="material-icons text-4xl text-gray-300 dark:text-gray-600 mb-2">note_add</span>
            <p class="text-gray-500 dark:text-gray-400">
                {{ getActivePatientId() ? 'No notes found for this patient.' : 'Select a patient to view/add notes.' }}
            </p>
          </div>
        }
      </div>
    </div>
    `
})
export class NotesComponent implements OnInit {
  @Input() patientId!: string; // Optional if routed
  selectedPatientId: string = '';
  assignedPatients: any[] = [];
  
  notes: any[] = [];
  noteText = '';
  editIndex = -1;
  loading = false;
  error = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    if (this.patientId) {
      this.loadNotes(this.patientId);
    } else {
        this.loadAssignedPatients();
    }
  }

  loadAssignedPatients() {
      this.doctorService.getAssignedPatients().subscribe((res: any) => {
          this.assignedPatients = res.data || res;
      });
  }

  onPatientSelect() {
      if (this.selectedPatientId) {
          this.loadNotes(this.selectedPatientId);
      }
  }

  getActivePatientId(): string {
      return this.patientId || this.selectedPatientId;
  }

  loadNotes(id: string) {
    this.loading = true;
    this.error = '';
    // Use getPatientPrescriptions as notes are stored as prescriptions with empty meds for now
    // OR getPatientDetails(id) if notes are appended to patient?
    // DoctorService.getPatientDetails calls /patients/:id. 
    // Patient model might NOT have notes field directly if we are using MedicalRecord.
    // DoctorService.addNoteToPatient uses createPrescription -> MedicalRecord.
    // So we should fetch MedicalRecords (Prescriptions) to see notes.
    
    this.doctorService.getPatientPrescriptions(id).subscribe({
      next: (res: any) => {
        const data = res.data || res;
        // Filter those that are 'Prescription' type and have notes?
        this.notes = data; 
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load notes';
        this.loading = false;
      }
    });
  }

  addOrUpdateNote() {
    const activeId = this.getActivePatientId();
    if (!this.noteText.trim() || !activeId) return;

    if (this.editIndex === -1) {
      this.loading = true;
      this.doctorService.addNoteToPatient(activeId, { text: this.noteText }).subscribe({
        next: (res: any) => {
          this.notes.unshift(res.data);
          this.noteText = '';
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert('Failed to save note');
        }
      });
    } else {
      // Edit not fully supported via API yet for specific record updates in this view
      // Just clear for now
      this.editIndex = -1;
      this.noteText = '';
    }
  }

  getNoteText(note: any): string {
      if (note.text) return note.text;
      // Parse treatment JSON if from MedicalRecord
      try {
          const treatment = typeof note.treatment === 'string' ? JSON.parse(note.treatment) : note.treatment;
          return treatment.notes || treatment.text || 'No content';
      } catch (e) {
          return 'Error parsing note';
      }
  }

  resetForm() {
    this.noteText = '';
    this.editIndex = -1;
  }
}