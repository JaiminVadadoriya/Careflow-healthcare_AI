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
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
           <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <span class="material-icons text-blue-600">person_add</span> Register New Patient
           </h2>
           <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter patient details to create a new medical record.</p>
        </div>
        
        <div class="p-6">
          <!-- Global Error/Success Alerts -->
          @if (errorMessage) {
            <div class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 flex items-center gap-3">
              <span class="material-icons text-xl">error_outline</span>
              <span>{{ errorMessage }}</span>
            </div>
          }
          @if (successMessage) {
            <div class="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30 flex items-center gap-3">
              <span class="material-icons text-xl">check_circle_outline</span>
              <span>{{ successMessage }}</span>
            </div>
          }

          <form (ngSubmit)="form.form.valid && registerPatient()" #form="ngForm" class="space-y-8">
            
            <!-- Section: Personal Information -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide flex items-center gap-2">
                 <span class="material-icons text-base">badge</span> Personal Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Full Name -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name <span class="text-red-500">*</span></label>
                  <input [(ngModel)]="formData.full_name" name="fn" #fn="ngModel" required minlength="3" placeholder="e.g. John Doe" 
                         class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                         [class.border-red-500]="fn.invalid && (fn.dirty || fn.touched)">
                  @if (fn.invalid && (fn.dirty || fn.touched)) {
                    <p class="text-xs text-red-500">Full name is required (min 3 chars).</p>
                  }
                </div>

                <!-- DOB -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth <span class="text-red-500">*</span></label>
                  <input type="date" [(ngModel)]="formData.dob" name="dob" #dob="ngModel" required
                         class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                         [class.border-red-500]="dob.invalid && (dob.dirty || dob.touched)">
                   @if (dob.invalid && (dob.dirty || dob.touched)) {
                    <p class="text-xs text-red-500">Date of birth is required.</p>
                  }
                </div>

                <!-- Gender -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender <span class="text-red-500">*</span></label>
                  <div class="relative">
                    <select [(ngModel)]="formData.gender" name="gender" #gender="ngModel" required
                            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                            [class.border-red-500]="gender.invalid && (gender.dirty || gender.touched)">
                      <option value="" disabled selected>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <span class="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">expand_more</span>
                  </div>
                   @if (gender.invalid && (gender.dirty || gender.touched)) {
                    <p class="text-xs text-red-500">Gender is required.</p>
                  }
                </div>
              </div>
            </div>
    
            <!-- Section: Contact Details -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide flex items-center gap-2">
                 <span class="material-icons text-base">contact_phone</span> Contact Details
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Phone -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number <span class="text-red-500">*</span></label>
                  <input [(ngModel)]="formData.contact_info.phone" name="phone" #phone="ngModel" required pattern="^[0-9]{10}$" placeholder="10-digit number"
                         class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                         [class.border-red-500]="phone.invalid && (phone.dirty || phone.touched)">
                   @if (phone.invalid && (phone.dirty || phone.touched)) {
                    <p class="text-xs text-red-500">Valid 10-digit phone required.</p>
                  }
                </div>

                <!-- Email -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                  <input type="email" [(ngModel)]="formData.contact_info.email" name="email" #email="ngModel" email placeholder="john@example.com"
                         class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                         [class.border-red-500]="email.invalid && (email.dirty || email.touched)">
                   @if (email.invalid && (email.dirty || email.touched)) {
                    <p class="text-xs text-red-500">Please enter a valid email.</p>
                  }
                </div>

                <!-- Address -->
                 <div class="space-y-1 md:col-span-3">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Residential Address <span class="text-red-500">*</span></label>
                  <input [(ngModel)]="formData.contact_info.address" name="address" #address="ngModel" required placeholder="Full Street Address"
                         class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                         [class.border-red-500]="address.invalid && (address.dirty || address.touched)">
                   @if (address.invalid && (address.dirty || address.touched)) {
                    <p class="text-xs text-red-500">Address is required.</p>
                  }
                </div>
              </div>
            </div>
    
            <!-- Section: Emergency & Assignment -->
            <div class="space-y-4">
              <h3 class="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide flex items-center gap-2">
                 <span class="material-icons text-base">emergency</span> Emergency & Assignment
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <!-- Emergency Contact -->
                 <div class="space-y-3 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-900/10">
                    <h4 class="text-sm font-medium text-orange-800 dark:text-orange-300 mb-2">Emergency Contact</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       <input [(ngModel)]="formData.emergency_contact.name" name="e_name" #e_name="ngModel" required placeholder="Name *" 
                              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                       <input [(ngModel)]="formData.emergency_contact.phone" name="e_phone" #e_phone="ngModel" required pattern="^[0-9]{10}$" placeholder="Phone *" 
                              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                       <input [(ngModel)]="formData.emergency_contact.relation" name="e_rel" #e_rel="ngModel" required placeholder="Relation *" 
                              class="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none sm:col-span-2">
                    </div>
                 </div>

                 <!-- Assign Doctor -->
                 <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign Primary Doctor <span class="text-red-500">*</span></label>
                    <div class="relative">
                      <select [(ngModel)]="formData.assigned_doctor" name="doctor" #doctor="ngModel" required
                              class="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                              [class.border-red-500]="doctor.invalid && (doctor.dirty || doctor.touched)">
                        <option value="" disabled selected>Select Doctor</option>
                        @for (doc of doctors; track doc) {
                          <option [value]="doc._id">Dr. {{ doc.full_name }} ({{ doc.specialization || 'General' }})</option>
                        }
                      </select>
                      <span class="material-icons absolute right-3 top-3.5 text-gray-400 pointer-events-none">expand_more</span>
                    </div>
                     @if (doctor.invalid && (doctor.dirty || doctor.touched)) {
                      <p class="text-xs text-red-500">Please assign a doctor.</p>
                    }
                 </div>
              </div>
            </div>
    
            <!-- Form Actions -->
            <div class="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-700 gap-4">
              <button type="button" (click)="resetForm()" class="px-6 py-2.5 rounded-xl font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                 Clear
              </button>
              <button type="submit" [disabled]="form.invalid || loading" 
                      class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2">
                @if (loading) { <span class="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></span> }
                <span>{{ loading ? 'Registering...' : 'Register Patient' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    
      <!-- Patients List Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h2 class="text-xl font-bold text-gray-900 dark:text-white">Registered Patients</h2>
           <p class="text-sm text-gray-500 dark:text-gray-400">Total: {{ patients.length }} records</p>
        </div>
        <div class="relative w-full max-w-sm">
          <input
            type="text"
            [(ngModel)]="search"
            (ngModelChange)="applyFilter()"
            placeholder="Search by name, phone, or email..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
            >
            <span class="material-icons absolute left-3 top-3 text-gray-400">search</span>
        </div>
      </div>

      <!-- Patients Table -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Patient Details</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Contact Info</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Emergency</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Assigned To</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Status</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              @for (patient of filteredPatients; track patient) {
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td class="p-4">
                    <div class="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{{ patient.full_name }}</div>
                    <div class="text-xs text-gray-500 flex items-center gap-1 mt-1">
                       <span class="capitalize">{{ patient.gender }}</span>
                       <span class="h-1 w-1 bg-gray-300 rounded-full"></span>
                       <span>{{ patient.dob | date:'mediumDate' }}</span>
                    </div>
                  </td>
                  <td class="p-4">
                    <div class="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                       <span class="material-icons text-[14px] text-gray-400">phone</span> {{ patient.contact_info?.phone }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1 pl-5">{{ patient.contact_info?.email || 'No email' }}</div>
                  </td>
                  <td class="p-4">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ patient.emergency_contact?.name }}</div>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ patient.emergency_contact?.relation }} • {{ patient.emergency_contact?.phone }}
                    </div>
                  </td>
                  <td class="p-4">
                     <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium">
                        <span class="material-icons text-[14px]">medical_services</span>
                        {{ patient.assigned_doctor?.full_name || patient.assigned_doctor || 'Unassigned' }}
                     </span>
                  </td>
                  <td class="p-4">
                    <span [class]="'px-2.5 py-1 rounded-full text-xs font-medium border ' + 
                       (patient.current_status === 'admitted' 
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' 
                          : 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')">
                       {{ patient.current_status || 'Registered' | titlecase }}
                    </span>
                  </td>
                   <td class="p-4">
                     <button (click)="openAssignModal(patient)" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium">
                        <span class="material-icons text-sm">edit</span> Assign
                     </button>
                   </td>
                </tr>
              }
              @if (filteredPatients.length === 0) {
                <tr>
                  <td colspan="6" class="p-12 text-center">
                     <div class="flex flex-col items-center justify-center text-gray-400">
                        <span class="material-icons text-4xl mb-2 text-gray-300 dark:text-gray-600">search_off</span>
                        <p class="text-sm">No patients found matching your search.</p>
                     </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Assign Doctor Modal -->
      @if (showAssignModal) {
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
           <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700">
              <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                 <h3 class="font-bold text-gray-900 dark:text-white">Assign Doctor</h3>
                 <button (click)="closeAssignModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <span class="material-icons">close</span>
                 </button>
              </div>
              <div class="p-6 space-y-4">
                 <p class="text-sm text-gray-600 dark:text-gray-300">
                    Assigning a new doctor for <strong>{{ selectedPatient?.full_name }}</strong>.
                 </p>
                 <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Doctor</label>
                    <div class="relative">
                      <select [(ngModel)]="newDoctorId" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
                         <option value="" disabled>Choose a doctor</option>
                         @for (d of doctors; track d) {
                            <option [value]="d._id">Dr. {{ d.full_name }} ({{ d.specialization }})</option>
                         }
                      </select>
                      <span class="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none text-sm">expand_more</span>
                    </div>
                 </div>
                 <div class="flex justify-end gap-3 pt-2">
                    <button (click)="closeAssignModal()" class="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium">Cancel</button>
                    <button (click)="assignDoctor()" [disabled]="!newDoctorId" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm disabled:opacity-50">Confirm Assignment</button>
                 </div>
              </div>
           </div>
        </div>
      }
    </div>
  `
})
export class PatientsComponent implements OnInit {
  patients: any[] = [];
  filteredPatients: any[] = [];
  doctors: any[] = [];
  search = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  formData = {
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
      },
      error: () => this.errorMessage = 'Failed to load patients list.'
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
    this.errorMessage = '';
    this.successMessage = '';

    this.receptionistService.registerPatient(this.formData).subscribe({
      next: (res: any) => {
         this.patients.unshift(res.data);
         this.applyFilter();
         this.resetForm();
         this.loading = false;
         this.successMessage = 'Patient registered successfully!';
         setTimeout(() => this.successMessage = '', 5000);
      },
      error: (err) => {
         this.loading = false;
         this.errorMessage = err.error?.message || 'Registration failed. Please check the details and try again.';
      }
    });
  }

  resetForm() {
    this.formData = {
       full_name: '', dob: '', gender: '', assigned_doctor: '',
       contact_info: { phone: '', email: '', address: '' },
       emergency_contact: { name: '', phone: '', relation: '' }
    };
  }

  applyFilter() {
    const term = this.search.trim().toLowerCase();
    this.filteredPatients = this.patients.filter(p => 
      p.full_name?.toLowerCase().includes(term) ||
      p.contact_info?.phone?.includes(term) ||
      p.contact_info?.email?.toLowerCase().includes(term)
    );
  }
  // Assignment Modal
  showAssignModal = false;
  selectedPatient: any = null;
  newDoctorId = '';

  openAssignModal(patient: any) {
    this.selectedPatient = patient;
    this.newDoctorId = patient.assigned_doctor?._id || patient.assigned_doctor || '';
    this.showAssignModal = true;
  }

  closeAssignModal() {
     this.showAssignModal = false;
     this.selectedPatient = null;
     this.newDoctorId = '';
  }

  assignDoctor() {
     if (!this.selectedPatient || !this.newDoctorId) return;
     
     this.receptionistService.assignDoctor(this.selectedPatient._id, this.newDoctorId).subscribe({
        next: (res: any) => {
           // Update local data
           const pIndex = this.patients.findIndex(p => p._id === this.selectedPatient._id);
           if (pIndex !== -1) {
              this.patients[pIndex] = res.data;
              this.applyFilter();
           }
           this.successMessage = 'Doctor assigned successfully';
           setTimeout(() => this.successMessage = '', 3000);
           this.closeAssignModal();
        },
        error: (err) => alert(err.error?.message || 'Failed to assign doctor')
     });
  }
}


