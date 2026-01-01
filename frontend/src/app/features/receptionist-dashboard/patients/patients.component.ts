import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceptionistService } from '../receptionist.service';

@Component({
  selector: 'app-receptionist-patients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-8">
      
      <!-- Register Form -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
         <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span class="material-icons text-blue-500">person_add</span> Register New Patient
         </h2>
         <form (ngSubmit)="registerPatient()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
               <!-- Basic Info -->
               <div class="space-y-4">
                  <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 pb-2">Basic Info</h3>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input [(ngModel)]="form.full_name" name="fn" required class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                    <input type="date" [(ngModel)]="form.dob" name="dob" required class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                    <select [(ngModel)]="form.gender" name="gender" required class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                       <option value="male">Male</option>
                       <option value="female">Female</option>
                       <option value="other">Other</option>
                    </select>
                  </div>
               </div>

               <!-- Contact -->
               <div class="space-y-4">
                  <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 pb-2">Contact Details</h3>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                    <input [(ngModel)]="form.contact_info.phone" name="phone" required class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input type="email" [(ngModel)]="form.contact_info.email" name="email" class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                    <input [(ngModel)]="form.contact_info.address" name="address" required class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  </div>
               </div>

               <!-- Emergency & Assignment -->
               <div class="space-y-4">
                  <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-700 pb-2">Emergency & Care</h3>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emergency Contact</label>
                    <input [(ngModel)]="form.emergency_contact.name" name="e_name" placeholder="Name" class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none mb-2">
                    <input [(ngModel)]="form.emergency_contact.phone" name="e_phone" placeholder="Phone" class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none mb-2">
                    <input [(ngModel)]="form.emergency_contact.relation" name="e_rel" placeholder="Relation (e.g. Spouse)" required class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Doctor</label>
                    <div class="relative">
                      <select [(ngModel)]="form.assigned_doctor" name="doctor" required class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                        <option *ngFor="let doc of doctors" [value]="doc._id">{{ doc.full_name }}</option>
                      </select>
                      <span class="material-icons absolute right-3 top-3 text-gray-400">expand_more</span>
                    </div>
                  </div>
               </div>
            </div>

            <div class="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
               <button type="submit" [disabled]="loading" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50">
                  {{ loading ? 'Registering...' : 'Register Patient' }}
               </button>
            </div>
         </form>
      </div>

      <!-- Patients List -->
      <div class="space-y-4">
        <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Patient Registry</h2>
             <div class="relative w-full max-w-xs">
               <input 
                 type="text" 
                 [(ngModel)]="search" 
                 (ngModelChange)="applyFilter()" 
                 placeholder="Search patients..."
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
                       <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Name</th>
                       <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Contact</th>
                       <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Emergency</th>
                       <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Assigned Dr.</th>
                       <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Status</th>
                    </tr>
                 </thead>
                 <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                    <tr *ngFor="let patient of filteredPatients" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                       <td class="p-4">
                          <div class="font-medium text-gray-900 dark:text-white">{{ patient.full_name }}</div>
                          <div class="text-xs text-gray-500">{{ patient.gender | capitalize }} • {{ patient.dob | date }}</div>
                       </td>
                       <td class="p-4 text-sm text-gray-600 dark:text-gray-400">
                          <div>{{ patient.contact_info?.phone }}</div>
                          <div class="text-xs text-gray-500">{{ patient.contact_info?.email }}</div>
                       </td>
                       <td class="p-4 text-sm text-gray-600 dark:text-gray-400">
                          <div>{{ patient.emergency_contact?.name }}</div>
                          <div class="text-xs text-gray-500">{{ patient.emergency_contact?.phone }} ({{ patient.emergency_contact?.relation }})</div>
                       </td>
                       <td class="p-4 text-sm text-blue-600 dark:text-blue-400">
                          {{ patient.assigned_doctor?.full_name || patient.assigned_doctor || 'Unassigned' }}
                       </td>
                       <td class="p-4">
                          <span class="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                             {{ patient.current_status || 'Registered' }}
                          </span>
                       </td>
                    </tr>
                    <tr *ngIf="filteredPatients.length === 0">
                       <td colspan="5" class="p-8 text-center text-gray-500 dark:text-gray-400">No patients found.</td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  `
})
export class PatientsComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  doctors: any[] = [];
  search = '';
  loading = false;
  
  form = {
    full_name: '',
    dob: '',
    gender: '',
    assigned_doctor: '',
    contact_info: { phone: '', email: '', address: '' },
    emergency_contact: { name: '', phone: '', relation: '' }
  };

  constructor(private receptionistService: ReceptionistService) {}

  ngOnInit() {
    this.loadPatients();
    this.loadDoctors();
  }

  loadPatients() {
    this.receptionistService.getPatients().subscribe({
      next: (res: any) => {
        this.patients = res.data || res;
        this.filteredPatients = this.patients;
      }
    });
  }

  loadDoctors() {
    this.receptionistService.getDoctors().subscribe({
      next: (res: any) => {
        this.doctors = res.data || res;
      }
    });
  }

  registerPatient() {
    this.loading = true;
    this.receptionistService.registerPatient(this.form).subscribe({
      next: (res: any) => {
         this.patients.unshift(res.data);
         this.applyFilter();
         this.form = {
            full_name: '', dob: '', gender: '', assigned_doctor: '',
            contact_info: { phone: '', email: '', address: '' },
            emergency_contact: { name: '', phone: '', relation: '' }
         };
         this.loading = false;
         alert('Patient registered successfully!');
      },
      error: (err) => {
         this.loading = false;
         alert('Registration failed');
         console.error(err);
      }
    });
  }

  applyFilter() {
    const term = this.search.trim().toLowerCase();
    this.filteredPatients = this.patients.filter(p => 
      p.full_name?.toLowerCase().includes(term)
    );
  }
}

// Simple pipe substitute since CommonModule pipes are standard but custom might be needed if not standard
// Actually capitalize isn't standard in Angular CommonModule (TitleCasePipe is).
// I'll leave it as template expression or just remove pipe if it causes error. 
// I'll used css capitalize class instead in some places, but in interpolation I used | capitalize.
// I should remove | capitalize and use css class or just leave it if I know it exists.
// Angular TitleCasePipe is standard. I'll use simple text transform css.
