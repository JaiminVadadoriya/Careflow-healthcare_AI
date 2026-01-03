import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for pipes
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
],
  template: `
    <div class="p-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">My Schedule</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Manage your consultation appointments</p>
        </div>
      </div>
    
      <!-- Filters -->
      <div class="flex flex-col md:flex-row gap-4 mb-6 sticky top-0 bg-gray-50 dark:bg-gray-900/50 p-3 -mx-2 rounded-xl backdrop-blur-sm z-10 border border-gray-100 dark:border-gray-800">
        <!-- Status Filter -->
        <div class="w-full md:w-1/4">
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">By Status</label>
          <div class="relative">
            <select [(ngModel)]="statusFilter" (change)="applyFilter()" class="w-full appearance-none px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer text-sm">
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="arrived">Arrived</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span class="material-icons absolute right-3 top-2.5 text-gray-400 text-sm pointer-events-none">expand_more</span>
          </div>
        </div>
    
        <!-- Date Filter -->
        <div class="w-full md:w-1/4">
          <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">By Date</label>
          <input type="date" [(ngModel)]="dateFilter" (change)="applyFilter()" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm">
        </div>
      </div>
    
      <!-- Loading -->
      @if (loading) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      }
    
      <!-- Error -->
      @if (error) {
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
          {{ error }}
        </div>
      }
    
      <!-- Table -->
      @if (!loading) {
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                  <th class="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Time</th>
                  <th class="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Patient</th>
                  <th class="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Reason</th>
                  <th class="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Status</th>
                  <th class="p-4 text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                @for (appt of filteredAppointments; track appt._id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                    <!-- Date/Time -->
                    <td class="p-4 whitespace-nowrap">
                       <div class="flex flex-col">
                         <span class="text-sm font-semibold text-gray-900 dark:text-white">
                            {{ appt.date_time | date:'shortTime' }}
                         </span>
                         <span class="text-xs text-gray-500 dark:text-gray-400">
                            {{ appt.date_time | date:'mediumDate' }}
                         </span>
                       </div>
                    </td>

                    <!-- Patient -->
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                         <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs uppercase">
                            {{ (appt.patient?.full_name || appt.patient || 'Unknown').charAt(0) }}
                         </div>
                         <div class="flex flex-col">
                            <span class="text-sm font-medium text-gray-900 dark:text-white">
                                {{ appt.patient?.full_name || appt.patient || 'Unknown Patient' }}
                            </span>
                            @if (appt.patient?.contact_info?.phone) {
                                <span class="text-xs text-gray-500">{{ appt.patient.contact_info.phone }}</span>
                            }
                         </div>
                      </div>
                    </td>

                    <!-- Reason -->
                    <td class="p-4 max-w-xs">
                       <p class="text-sm text-gray-600 dark:text-gray-300 truncate" [title]="appt.reason">
                          {{ appt.reason || 'No reason provided' }}
                       </p>
                    </td>

                    <!-- Status -->
                    <td class="p-4">
                      <span [class]="'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ' + 
                        (appt.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 
                         appt.status === 'cancelled' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' :
                         appt.status === 'arrived' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' :
                         'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800')">
                         <span class="w-1.5 h-1.5 rounded-full mr-1.5"
                            [class]="appt.status === 'completed' ? 'bg-green-500' : appt.status === 'cancelled' ? 'bg-red-500' : appt.status === 'arrived' ? 'bg-purple-500' : 'bg-blue-500'">
                         </span>
                         {{ appt.status }}
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="p-4 text-right">
                      @if (appt.status === 'scheduled' || appt.status === 'arrived') {
                        <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          @if (appt.status === 'scheduled') {
                              <button (click)="updateStatus(appt, 'arrived')" 
                                      class="text-xs flex items-center gap-1 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 px-3 py-1.5 rounded-lg transition-colors font-medium">
                                <span class="material-icons text-[14px]">directions_walk</span> Arrived
                              </button>
                          }
                          <button (click)="updateStatus(appt, 'completed')" 
                                  class="text-xs flex items-center gap-1 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-3 py-1.5 rounded-lg transition-colors font-medium">
                            <span class="material-icons text-[14px]">check</span> Complete
                          </button>
                          <button (click)="updateStatus(appt, 'cancelled')" 
                                  class="text-xs flex items-center gap-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-lg transition-colors font-medium">
                            <span class="material-icons text-[14px]">block</span> Cancel
                          </button>
                          <button (click)="openRescheduleModal(appt)" 
                                  class="text-xs flex items-center gap-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-lg transition-colors font-medium">
                            <span class="material-icons text-[14px]">edit_calendar</span> Reschedule
                          </button>
                        </div>
                      }
                      @if (appt.status !== 'scheduled' && appt.status !== 'arrived') {
                        <span class="text-xs text-gray-400 italic">No further actions</span>
                      }
                    </td>
                  </tr>
                }
                <!-- Empty -->
                @if (filteredAppointments.length === 0) {
                  <tr>
                    <td colspan="5" class="p-12 text-center text-gray-500 dark:text-gray-400">
                       <div class="flex flex-col items-center justify-center">
                          <span class="material-icons text-4xl text-gray-300 dark:text-gray-600 mb-2">event_busy</span>
                          <p>No appointments found{{ statusFilter ? ' with status ' + statusFilter : '' }}.</p>
                       </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    
      <!-- Reschedule Modal -->
      @if (showRescheduleModal) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden scale-100 transition-all">
                <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">Reschedule Appointment</h3>
                    <button (click)="closeRescheduleModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                
                <div class="p-6 space-y-4">
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                        Rescheduling for <span class="font-semibold text-gray-900 dark:text-white">{{ selectedApptForReschedule?.patient?.full_name || 'Patient' }}</span>
                    </p>
                    <div>
                        <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">New Date & Time</label>
                        <input type="datetime-local" [(ngModel)]="newRescheduleDate" class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    </div>
                </div>

                <div class="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                    <button (click)="closeRescheduleModal()" class="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors">Cancel</button>
                    <button (click)="confirmReschedule()" class="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/30 transition-all">Confirm Reschedule</button>
                </div>
            </div>
        </div>
      }
    </div>
    `
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  statusFilter = '';
  dateFilter = '';
  loading = false;
  error = '';

  constructor(private doctorService: DoctorService) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.error = '';
    this.doctorService.getAppointments().subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.appointments = data;
        this.applyFilter();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load appointments';
        this.loading = false;
      }
    });
  }

  applyFilter() {
    let filtered = this.appointments;
    if (this.statusFilter) {
      filtered = filtered.filter((a: any) => a.status === this.statusFilter);
    }
    if (this.dateFilter) {
       // Assuming 'date_time' is ISO string. compare YYYY-MM-DD
      filtered = filtered.filter((a: any) => a.date_time && a.date_time.startsWith(this.dateFilter));
    }
    this.filteredAppointments = filtered;
  }

  updateStatus(appt: any, status: string) {
    if (!confirm(`Are you sure you want to mark this appointment as ${status}?`)) return;

    const oldStatus = appt.status;
    appt.status = status; // Optimistic update

    this.doctorService.updateAppointmentStatus(appt._id, status).subscribe({
      next: () => {},
      error: (err) => { 
        appt.status = oldStatus; // Revert
        alert(err.error?.message || 'Failed to update status');
      }
    });
  }

  // Reschedule Logic
  showRescheduleModal = false;
  selectedApptForReschedule: any = null;
  newRescheduleDate: string = '';

  openRescheduleModal(appt: any) {
    this.selectedApptForReschedule = appt;
    // Format current date for datetime-local input (YYYY-MM-DDTHH:mm)
    // Assuming appt.date_time is ISO string
    if (appt.date_time) {
        this.newRescheduleDate = new Date(appt.date_time).toISOString().slice(0, 16);
    }
    this.showRescheduleModal = true;
  }

  closeRescheduleModal() {
      this.showRescheduleModal = false;
      this.selectedApptForReschedule = null;
      this.newRescheduleDate = '';
  }

  confirmReschedule() {
      if (!this.selectedApptForReschedule || !this.newRescheduleDate) return;
      
      this.doctorService.rescheduleAppointment(this.selectedApptForReschedule._id, this.newRescheduleDate).subscribe({
          next: (res) => {
              alert('Appointment rescheduled successfully');
              this.selectedApptForReschedule.date_time = this.newRescheduleDate; // Update local state
              this.selectedApptForReschedule.status = 'scheduled';
              this.closeRescheduleModal();
          },
          error: (err) => {
              alert(err.error?.message || 'Failed to reschedule');
          }
      });
  }
}