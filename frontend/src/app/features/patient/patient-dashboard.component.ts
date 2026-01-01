import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../../shared/layout/dashboard-layout.component';
import { MetricCardComponent } from '../../shared/ui/metric-card.component';
import { ActionCardComponent } from '../../shared/ui/action-card.component';
import { PatientService } from './patient.service';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DashboardLayoutComponent,
    MetricCardComponent,
    ActionCardComponent
  ],
  template: `
    <app-dashboard-layout>
      <!-- Welcome Section -->
      <div class="mb-8" *ngIf="profile">
        <h2 class="text-3xl font-bold text-gray-800 dark:text-white">
          Hello, {{ profile.full_name }} 👋
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Here is your personal health overview.
        </p>
      </div>

      <!-- Profile Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" *ngIf="profile">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
            <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Patient ID</span>
            <span class="text-lg font-bold text-gray-900 dark:text-white truncate">{{ profile._id || 'N/A' }}</span>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
             <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email</span>
             <span class="text-lg font-bold text-gray-900 dark:text-white truncate">{{ profile.email }}</span>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
             <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Date of Birth</span>
             <span class="text-lg font-bold text-gray-900 dark:text-white">{{ profile.dob || 'Not set' }}</span>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
             <span class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Gender</span>
             <span class="text-lg font-bold text-gray-900 dark:text-white capitalize">{{ profile.gender }}</span>
        </div>
      </div>

      <!-- Book Appointment Section -->
      <div class="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 mb-10">
         <h3 class="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
            <span class="material-icons">event</span> Book New Appointment
         </h3>
         <form (ngSubmit)="bookAppointment()" class="flex flex-col md:flex-row gap-4 items-end">
             <div class="w-full md:w-1/3">
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor ID</label>
                 <input [(ngModel)]="apptForm.doctorId" name="doctorId" type="text" placeholder="Paste ID here" required
                        class="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-sm"/>
             </div>
             <div class="w-full md:w-1/3">
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date & Time</label>
                 <input [(ngModel)]="apptForm.date_time" name="date_time" type="datetime-local" required
                        class="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-sm"/>
             </div>
             <div class="w-full md:w-1/3">
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
                 <input [(ngModel)]="apptForm.reason" name="reason" type="text" placeholder="Checkup..." required
                        class="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-sm"/>
             </div>
             <button type="submit" 
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors whitespace-nowrap">
                Book Now
             </button>
         </form>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <!-- Appointment List -->
          <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span class="material-icons text-blue-500">schedule</span> Your Appointments
              </h3>
              <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                      <thead>
                          <tr class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700">
                              <th class="py-3 px-2">Doctor</th>
                              <th class="py-3 px-2">Date</th>
                              <th class="py-3 px-2">Reason</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr *ngFor="let appt of appointments" class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-sm text-gray-700 dark:text-gray-300">
                              <td class="py-3 px-2 font-medium">{{ appt.doctor?.full_name || appt.doctorId }}</td>
                              <td class="py-3 px-2">{{ appt.date_time | date:'short' }}</td>
                              <td class="py-3 px-2">{{ appt.reason }}</td>
                          </tr>
                          <tr *ngIf="appointments.length === 0">
                              <td colspan="3" class="py-8 text-center text-gray-500 dark:text-gray-400 italic">No appointments found.</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

          <!-- Medical Records & Lab Results (Tabs or Stacked) -->
          <div class="space-y-8">
              <!-- Lab Results -->
              <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                       <span class="material-icons text-purple-500">science</span> Lab Results
                  </h3>
                  <div class="overflow-x-auto">
                     <table class="w-full text-left border-collapse">
                         <thead>
                             <tr class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700">
                                 <th class="py-3 px-2">Test</th>
                                 <th class="py-3 px-2">Date</th>
                                 <th class="py-3 px-2">Result</th>
                             </tr>
                         </thead>
                          <tbody>
                              <tr *ngFor="let res of labResults" class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-sm text-gray-700 dark:text-gray-300">
                                  <td class="py-3 px-2 font-medium">{{ res.test_name }}</td>
                                  <td class="py-3 px-2">{{ res.test_date | date }}</td>
                                  <td class="py-3 px-2">
                                      <span class="px-2 py-1 rounded text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">{{ res.result }}</span>
                                  </td>
                              </tr>
                               <tr *ngIf="labResults.length === 0">
                                  <td colspan="3" class="py-8 text-center text-gray-500 dark:text-gray-400 italic">No lab results found.</td>
                               </tr>
                          </tbody>
                     </table>
                  </div>
              </div>

               <!-- Medical Records -->
              <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                   <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span class="material-icons text-red-500">history_edu</span> Medical Records
                   </h3>
                   <div class="space-y-4">
                       <div *ngFor="let record of medicalRecords" class="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                           <div class="flex justify-between items-start mb-1">
                               <h4 class="font-bold text-gray-900 dark:text-white text-base">{{ record.diagnosis }}</h4>
                               <span class="text-xs text-gray-500 dark:text-gray-400">{{ record.date_time | date }}</span>
                           </div>
                           <p class="text-sm text-gray-600 dark:text-gray-400">Treatment: {{ record.treatment }}</p>
                       </div>
                       <div *ngIf="medicalRecords.length === 0" class="py-4 text-center text-gray-500 dark:text-gray-400 italic">
                           No medical records available.
                       </div>
                   </div>
              </div>

          </div>
      </div>
    </app-dashboard-layout>
  `,
})
export class PatientDashboardComponent implements OnInit {
  profile: any;
  appointments: any[] = [];
  labResults: any[] = [];
  medicalRecords: any[] = [];
  apptForm = { doctorId: '', date_time: '', reason: '' };

  constructor(
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.patientService.getProfile().subscribe((res: any) => (this.profile = res.data || res));
    this.patientService.getAppointments().subscribe((res: any) => (this.appointments = res.data || res));
    this.patientService.getLabResults().subscribe((res: any) => (this.labResults = res.data || res));
    this.patientService.getMedicalRecords().subscribe((res: any) => (this.medicalRecords = res.data || res));
  }

  bookAppointment() {
    this.patientService.bookAppointment(this.apptForm).subscribe({
      next: (res: any) => {
        this.appointments = [res.data, ...this.appointments];
        alert('Appointment booked successfully!');
        this.apptForm = { doctorId: '', date_time: '', reason: '' };
      },
      error: () => {
        alert('Failed to book appointment. Please try again.');
      },
    });
  }
}
