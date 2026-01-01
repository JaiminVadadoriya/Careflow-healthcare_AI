import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceptionistService } from '../receptionist.service';

@Component({
  selector: 'app-receptionist-appointments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-8">
      
      <!-- Booking Form -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
         <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span class="material-icons text-blue-500">event_note</span> Book Appointment
         </h2>
         <form (ngSubmit)="bookAppointment()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient</label>
              <div class="relative">
                 <select [(ngModel)]="form.patientId" name="pid" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                    <option value="" disabled selected>Select Patient</option>
                    <option *ngFor="let p of patients" [value]="p._id">{{ p.full_name }}</option>
                 </select>
                 <span class="material-icons absolute right-3 top-3 text-gray-400 text-sm pointer-events-none">expand_more</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Doctor</label>
              <div class="relative">
                 <select [(ngModel)]="form.doctorId" name="did" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                    <option value="" disabled selected>Select Doctor</option>
                    <option *ngFor="let d of doctors" [value]="d._id">Dr. {{ d.full_name }}</option>
                 </select>
                 <span class="material-icons absolute right-3 top-3 text-gray-400 text-sm pointer-events-none">expand_more</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date & Time</label>
              <input type="datetime-local" [(ngModel)]="form.date_time" name="dt" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason</label>
              <input type="text" [(ngModel)]="form.reason" name="reason" placeholder="Checkup..." required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
            <div class="lg:col-span-4 flex justify-end mt-2">
               <button type="submit" [disabled]="loading" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50">
                  {{ loading ? 'Booking...' : 'Confirm Booking' }}
               </button>
            </div>
         </form>
      </div>

      <!-- Appointments List -->
      <div class="space-y-4">
         <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Scheduled Appointments</h2>
             <div class="relative w-full max-w-xs">
               <input 
                 type="text" 
                 [(ngModel)]="search" 
                 (ngModelChange)="applyFilter()" 
                 placeholder="Search appointments..."
                 class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
               >
               <span class="material-icons absolute left-3 top-2.5 text-gray-400 text-sm">search</span>
            </div>
         </div>

         <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
               <table class="w-full text-left border-collapse">
                  <thead class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                     <tr>
                        <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Patient</th>
                        <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Doctor</th>
                        <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Date & Time</th>
                        <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Reason</th>
                        <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                     <tr *ngFor="let appt of filteredAppointments" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td class="p-4 font-medium text-gray-900 dark:text-white">{{ getPatientName(appt.patientId) }}</td>
                        <td class="p-4 text-blue-600 dark:text-blue-400">Dr. {{ getDoctorName(appt.doctorId) }}</td>
                        <td class="p-4 text-gray-700 dark:text-gray-300">
                           <span class="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm">
                              {{ appt.date_time | date:'medium' }}
                           </span>
                        </td>
                        <td class="p-4 text-gray-600 dark:text-gray-400 italic">{{ appt.reason }}</td>
                        <td class="p-4 text-right space-x-2">
                           <button (click)="reschedule(appt)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 p-2 rounded-lg transition-colors" title="Reschedule">
                              <span class="material-icons text-sm">edit_calendar</span>
                           </button>
                           <button (click)="confirmCancel(appt)" class="text-red-600 hover:text-red-800 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 p-2 rounded-lg transition-colors" title="Cancel">
                              <span class="material-icons text-sm">cancel</span>
                           </button>
                        </td>
                     </tr>
                     <tr *ngIf="filteredAppointments.length === 0">
                        <td colspan="5" class="p-8 text-center text-gray-500 dark:text-gray-400">No appointments found.</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  `
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  patients: any[] = [];
  doctors: any[] = [];
  search = '';
  loading = false;
  
  form = { patientId: '', doctorId: '', date_time: '', reason: '' };

  constructor(private receptionistService: ReceptionistService) {}

  ngOnInit() {
    this.loadAppointments();
    this.loadPatients();
    this.loadDoctors();
  }

  loadAppointments() {
    this.receptionistService.getAppointments().subscribe({
       next: (res: any) => {
          this.appointments = res.data || res;
          this.filteredAppointments = this.appointments;
       }
    });
  }
  
  loadPatients() {
     this.receptionistService.getPatients().subscribe((res: any) => this.patients = res.data || res);
  }

  loadDoctors() {
     this.receptionistService.getDoctors().subscribe((res: any) => this.doctors = res.data || res);
  }

  bookAppointment() {
    this.loading = true;
    this.receptionistService.bookAppointment(this.form).subscribe({
      next: (res: any) => {
        this.appointments.unshift(res.data);
        this.applyFilter();
        this.form = { patientId: '', doctorId: '', date_time: '', reason: '' };
        this.loading = false;
        alert('Appointment booked!');
      },
      error: () => {
        this.loading = false;
        alert('Booking failed');
      }
    });
  }

  applyFilter() {
     const term = this.search.trim().toLowerCase();
     this.filteredAppointments = this.appointments.filter(a => {
        const pName = this.getPatientName(a.patientId).toLowerCase();
        const dName = this.getDoctorName(a.doctorId).toLowerCase();
        return pName.includes(term) || dName.includes(term);
     });
  }

  getPatientName(id: string) {
     const p = this.patients.find(x => x._id === id);
     return p ? p.full_name : id;
  }

  getDoctorName(id: string) {
     const d = this.doctors.find(x => x._id === id);
     return d ? d.full_name : id;
  }

  confirmCancel(appt: any) {
    if (confirm('Cancel this appointment?')) {
       this.receptionistService.cancelAppointment(appt._id).subscribe({
          next: () => {
             this.appointments = this.appointments.filter(a => a._id !== appt._id);
             this.applyFilter();
          }
       });
    }
  }

  reschedule(appt: any) {
     const newDate = prompt('Enter new date/time (YYYY-MM-DDTHH:mm):', appt.date_time);
     if (newDate) {
        this.receptionistService.rescheduleAppointment(appt._id, newDate).subscribe({
           next: () => {
              appt.date_time = newDate;
              alert('Rescheduled successfully');
           }
        });
     }
  }
}
