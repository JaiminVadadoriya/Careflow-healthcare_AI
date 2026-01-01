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
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
           <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <span class="material-icons text-blue-600">event_note</span> Book Appointment
           </h2>
           <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Schedule a new consultation for a patient.</p>
        </div>

        <div class="p-6">
           <!-- Alerts -->
            @if (errorMessage) {
              <div class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 flex items-center gap-3 animate-fade-in">
                <span class="material-icons text-xl">error_outline</span>
                <span>{{ errorMessage }}</span>
              </div>
            }
            @if (successMessage) {
              <div class="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30 flex items-center gap-3 animate-fade-in">
                <span class="material-icons text-xl">check_circle_outline</span>
                <span>{{ successMessage }}</span>
              </div>
            }

          <form (ngSubmit)="form.form.valid && bookAppointment()" #form="ngForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <!-- Patient Selection -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Patient <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select [(ngModel)]="formData.patientId" name="pid" #pid="ngModel" required 
                          class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all"
                          [class.border-red-500]="pid.invalid && (pid.dirty || pid.touched)">
                    <option value="" disabled selected>Choose a patient...</option>
                    @for (p of patients; track p) {
                      <option [value]="p._id">{{ p.full_name }}</option>
                    }
                  </select>
                  <span class="material-icons absolute right-3 top-3 text-gray-400 text-sm pointer-events-none">expand_more</span>
                </div>
                 @if (pid.invalid && (pid.dirty || pid.touched)) {
                    <p class="text-xs text-red-500 mt-1">Patient is required.</p>
                 }
              </div>

              <!-- Doctor Selection -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Doctor <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select [(ngModel)]="formData.doctorId" name="did" #did="ngModel" required 
                          class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all"
                          [class.border-red-500]="did.invalid && (did.dirty || did.touched)">
                    <option value="" disabled selected>Choose a doctor...</option>
                    @for (d of doctors; track d) {
                      <option [value]="d._id">Dr. {{ d.full_name }} ({{ d.specialization || 'General' }})</option>
                    }
                  </select>
                  <span class="material-icons absolute right-3 top-3 text-gray-400 text-sm pointer-events-none">expand_more</span>
                </div>
                @if (did.invalid && (did.dirty || did.touched)) {
                    <p class="text-xs text-red-500 mt-1">Doctor is required.</p>
                 }
              </div>

              <!-- Date Selection -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time <span class="text-red-500">*</span></label>
                <input type="datetime-local" [(ngModel)]="formData.date_time" name="dt" #dt="ngModel" required 
                       class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                       [class.border-red-500]="dt.invalid && (dt.dirty || dt.touched)">
                 @if (dt.invalid && (dt.dirty || dt.touched)) {
                    <p class="text-xs text-red-500 mt-1">Valid date required.</p>
                 }
              </div>

            <!-- Reason -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason for Visit <span class="text-red-500">*</span></label>
                <input type="text" [(ngModel)]="formData.reason" name="reason" #reason="ngModel" placeholder="e.g. Annual Checkup" required 
                       class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                       [class.border-red-500]="reason.invalid && (reason.dirty || reason.touched)">
                 @if (reason.invalid && (reason.dirty || reason.touched)) {
                    <p class="text-xs text-red-500 mt-1">Reason is required.</p>
                 }
              </div>
              
              <!-- Availability Checker -->
              <div class="col-span-1 md:col-span-2 lg:col-span-4 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                 <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <h3 class="text-sm font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                       <span class="material-icons text-base">schedule</span> Doctor Availability
                    </h3>
                    <div class="flex items-center gap-2">
                       <input type="date" [(ngModel)]="availabilityDate" [ngModelOptions]="{standalone: true}" (change)="loadAvailability()" 
                              class="px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                       <button type="button" (click)="loadAvailability()" [disabled]="!formData.doctorId || !availabilityDate"
                               class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                          Check Slots
                       </button>
                    </div>
                 </div>
                 
                 @if (!formData.doctorId) {
                    <p class="text-sm text-gray-500 italic">Select a doctor to view availability.</p>
                 } @else if (loadingAvailability) {
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                       <span class="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></span> Checking schedule...
                    </div>
                 } @else if (availableSlots.length > 0) {
                    <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                       @for (slot of availableSlots; track slot.time) {
                          <button type="button" 
                                  (click)="selectSlot(slot)"
                                  [disabled]="!slot.available"
                                  [class]="'px-2 py-1.5 rounded text-xs font-medium border transition-all ' + 
                                     (slot.available 
                                        ? 'bg-white dark:bg-gray-800 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/30 hover:shadow-sm cursor-pointer' 
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 cursor-not-allowed')">
                             {{ slot.time }}
                          </button>
                       }
                    </div>
                 } @else if (availabilityDate) {
                    <p class="text-sm text-gray-500 italic">No slots found or selected date is in the past.</p>
                 }
              </div>

            </div>

            <div class="flex justify-end pt-4">
              <button type="submit" [disabled]="form.invalid || loading" 
                      class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2">
                 @if (loading) { <span class="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></span> }
                 <span>{{ loading ? 'Booking...' : 'Confirm Booking' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    
      <!-- Appointments List -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Scheduled Appointments</h2>
             <p class="text-sm text-gray-500 dark:text-gray-400">Total: {{ appointments.length }} upcoming</p>
          </div>
          <div class="relative w-full max-w-sm">
            <input
              type="text"
              [(ngModel)]="search"
              (ngModelChange)="applyFilter()"
              placeholder="Search by patient or doctor..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
              >
              <span class="material-icons absolute left-3 top-3 text-gray-400">search</span>
          </div>
        </div>
    
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Patient</th>
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Doctor</th>
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Date & Time</th>
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Reason</th>
                    <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                  @for (appt of filteredAppointments; track appt) {
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                      <td class="p-4">
                         <div class="font-medium text-gray-900 dark:text-white">{{ getPatientName(appt.patientId) }}</div>
                      </td>
                      <td class="p-4">
                         <div class="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium">
                            <span class="material-icons text-[14px]">local_hospital</span>
                            Dr. {{ getDoctorName(appt.doctorId) }}
                         </div>
                      </td>
                      <td class="p-4 text-gray-700 dark:text-gray-300">
                        <div class="flex items-center gap-2">
                           <span class="material-icons text-gray-400 text-sm">calendar_today</span>
                           <span class="text-sm">{{ appt.date_time | date:'medium' }}</span>
                        </div>
                      </td>
                      <td class="p-4 text-gray-600 dark:text-gray-400 text-sm italic">"{{ appt.reason }}"</td>
                      <td class="p-4 text-right space-x-2">
                        @if (appt.status === 'pending' || appt.status === 'confirmed') {
                          <button (click)="markArrived(appt)" class="text-green-600 hover:text-green-800 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 p-2 rounded-lg transition-colors" title="Mark Arrived">
                             <span class="material-icons text-sm">check</span>
                          </button>
                        }
                        <button (click)="reschedule(appt)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 p-2 rounded-lg transition-colors" title="Reschedule">
                          <span class="material-icons text-sm">edit_calendar</span>
                        </button>
                        <button (click)="confirmCancel(appt)" class="text-red-600 hover:text-red-800 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 p-2 rounded-lg transition-colors" title="Cancel">
                          <span class="material-icons text-sm">cancel</span>
                        </button>
                      </td>
                    </tr>
                  }
                  @if (filteredAppointments.length === 0) {
                    <tr>
                      <td colspan="5" class="p-12 text-center text-gray-500 dark:text-gray-400">
                         <div class="flex flex-col items-center justify-center">
                            <span class="material-icons text-4xl mb-2 text-gray-300 dark:text-gray-600">event_busy</span>
                            <p class="text-sm">No scheduled appointments found.</p>
                         </div>
                      </td>
                    </tr>
                  }
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
  errorMessage = '';
  successMessage = '';
  
  formData = { patientId: '', doctorId: '', date_time: '', reason: '' };

  // Availability variables
  availabilityDate: string = '';
  availableSlots: any[] = [];
  loadingAvailability = false;

  constructor(private receptionistService: ReceptionistService) {}

  ngOnInit() {
    this.loadAppointments();
    this.loadPatients();
    this.loadDoctors();
    
    // Default availability date to today
    const today = new Date();
    this.availabilityDate = today.toISOString().split('T')[0];
  }

  loadAppointments() {
    this.receptionistService.getAppointments().subscribe({
       next: (res: any) => {
          this.appointments = res.data || res;
          this.filteredAppointments = this.appointments;
       },
       error: () => this.errorMessage = 'Failed to load appointments.'
    });
  }
  
  loadPatients() {
     this.receptionistService.getPatients().subscribe((res: any) => this.patients = res.data || res);
  }

  loadDoctors() {
     this.receptionistService.getDoctors().subscribe((res: any) => this.doctors = res.data || res);
  }

  loadAvailability() {
     if (!this.formData.doctorId || !this.availabilityDate) return;
     
     this.loadingAvailability = true;
     this.availableSlots = [];
     
     this.receptionistService.checkAvailability(this.formData.doctorId, this.availabilityDate).subscribe({
        next: (res: any) => {
           this.availableSlots = res.data || res;
           this.loadingAvailability = false;
        },
        error: () => {
           this.errorMessage = "Failed to fetch availability.";
           this.loadingAvailability = false;
        }
     });
  }

  selectSlot(slot: any) {
     if (!slot.available) return;
     // slot.time is "09:00", availabilityDate is "YYYY-MM-DD"
     this.formData.date_time = `${this.availabilityDate}T${slot.time}`;
  }

  bookAppointment() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.receptionistService.bookAppointment(this.formData).subscribe({
      next: (res: any) => {
        this.appointments.unshift(res.data);
        this.applyFilter();
        this.formData = { patientId: '', doctorId: '', date_time: '', reason: '' };
        this.availableSlots = []; // clear slots
        this.loading = false;
        this.successMessage = 'Appointment booked successfully!';
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Booking failed. Please check the details and try again.';
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

  markArrived(appt: any) {
     if(confirm('Mark ' + this.getPatientName(appt.patientId) + ' as arrived?')) {
        this.receptionistService.updateAppointment(appt._id, { status: 'arrived' }).subscribe({
           next: () => {
              appt.status = 'arrived';
              alert('Marked as arrived');
           },
           error: () => alert('Failed to update status')
        });
     }
  }
}
