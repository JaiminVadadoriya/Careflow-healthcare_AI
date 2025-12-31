import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReceptionistService } from '../receptionist.service';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-receptionist-patients',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    MatOption,
    MatSelectModule,
  ],
  template: `
    <div class="p-6 max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Register New Patient</h2>

      <!-- 🧾 Registration Form -->
      <form (ngSubmit)="registerPatient()" class="flex flex-col gap-4 mb-8">
        <!-- Full Name -->
        <mat-form-field >
          <mat-label>Full Name</mat-label>
          <input
            matInput
            [(ngModel)]="form.full_name"
            name="full_name"
            required
          />
        </mat-form-field>

        <!-- Date of Birth -->
        <mat-form-field >
          <mat-label>Date of Birth</mat-label>
          <input
            matInput
            type="date"
            [(ngModel)]="form.dob"
            name="dob"
            required
          />
        </mat-form-field>

        <!-- Gender -->
        <mat-form-field >
          <mat-label>Gender</mat-label>
          <mat-select [(ngModel)]="form.gender" name="gender" required>
            <mat-option value="male">Male</mat-option>
            <mat-option value="female">Female</mat-option>
            <mat-option value="other">Other</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Contact Info -->
        <h3 class="text-lg font-semibold mt-2">Contact Info</h3>
        <mat-form-field >
          <mat-label>Phone</mat-label>
          <input
            matInput
            [(ngModel)]="form.contact_info.phone"
            name="contact_phone"
            required
          />
        </mat-form-field>

        <mat-form-field >
          <mat-label>Email</mat-label>
          <input
            matInput
            [(ngModel)]="form.contact_info.email"
            name="contact_email"
          />
        </mat-form-field>
        <mat-form-field >
          <mat-label>Address</mat-label>
          <input
            matInput
            [(ngModel)]="form.contact_info.address"
            name="contact_address"
            required
          />
        </mat-form-field>

        <!-- Emergency Contact -->
        <h3 class="text-lg font-semibold mt-2">Emergency Contact</h3>
        <mat-form-field >
          <mat-label>Emergency Contact Name</mat-label>
          <input
            matInput
            [(ngModel)]="form.emergency_contact.name"
            name="emergency_name"
          />
        </mat-form-field>

        <mat-form-field >
          <mat-label>Emergency Phone</mat-label>
          <input
            matInput
            [(ngModel)]="form.emergency_contact.phone"
            name="emergency_phone"
          />
        </mat-form-field>
        <mat-form-field >
          <mat-label>Emergency Contact Relation</mat-label>
          <input
            matInput
            [(ngModel)]="form.emergency_contact.relation"
            name="emergency_relation"
            required
          />
        </mat-form-field>

        <mat-form-field >
          <mat-label>Assign Doctor</mat-label>
          <mat-select
            [(ngModel)]="form.assigned_doctor"
            name="assigned_doctor"
            required
          >
            <mat-option *ngFor="let doctor of doctors" [value]="doctor._id">
              {{ doctor.full_name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Submit -->
        <button mat-raised-button color="primary" type="submit">
          Register
        </button>
      </form>

      <!-- 🔍 Search -->
      <h2 class="text-xl font-bold mb-4">Registered Patients</h2>
      <mat-form-field  class="w-full md:w-1/3 mb-4">
        <mat-label>Search Patients</mat-label>
        <input
          matInput
          [(ngModel)]="search"
          (ngModelChange)="applyFilter()"
          placeholder="Search by name or ID"
        />
      </mat-form-field>

      <!-- 🧾 Patients Table -->
      <div class="overflow-x-auto">
        <!-- 🧾 Patients Table -->
        <div class="overflow-x-auto">
          <table
            mat-table
            [dataSource]="dataSource"
            class="min-w-full bg-white dark:bg-gray-800 rounded shadow"
          >
            <!-- Full Name -->
            <ng-container matColumnDef="full_name">
              <th mat-header-cell *matHeaderCellDef>Full Name</th>
              <td mat-cell *matCellDef="let patient">
                {{ patient.full_name }}
              </td>
            </ng-container>

            <!-- DOB -->
            <ng-container matColumnDef="dob">
              <th mat-header-cell *matHeaderCellDef>DOB</th>
              <td mat-cell *matCellDef="let patient">
                {{ patient.dob | date }}
              </td>
            </ng-container>

            <!-- Gender -->
            <ng-container matColumnDef="gender">
              <th mat-header-cell *matHeaderCellDef>Gender</th>
              <td mat-cell *matCellDef="let patient">{{ patient.gender }}</td>
            </ng-container>

            <!-- Phone -->
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let patient">
                {{ patient.contact_info?.phone }}
              </td>
            </ng-container>

            <!-- Email -->
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let patient">
                {{ patient.contact_info?.email }}
              </td>
            </ng-container>

            <!-- Address -->
            <ng-container matColumnDef="address">
              <th mat-header-cell *matHeaderCellDef>Address</th>
              <td mat-cell *matCellDef="let patient">
                {{ patient.contact_info?.address }}
              </td>
            </ng-container>

            <!-- Emergency Contact Name -->
            <ng-container matColumnDef="emergency_name">
              <th mat-header-cell *matHeaderCellDef>Emergency Name</th>
              <td mat-cell *matCellDef="let patient">
                {{ patient.emergency_contact?.name }}
              </td>
            </ng-container>

            <!-- Emergency Phone -->
            <ng-container matColumnDef="emergency_phone">
              <th mat-header-cell *matHeaderCellDef>Emergency Phone</th>
              <td mat-cell *matCellDef="let patient">
                {{ patient.emergency_contact?.phone }}
              </td>
            </ng-container>

            <!-- Emergency Relation -->
            <ng-container matColumnDef="emergency_relation">
              <th mat-header-cell *matHeaderCellDef>Relation</th>
              <td mat-cell *matCellDef="let patient">
                {{ patient.emergency_contact?.relation }}
              </td>
            </ng-container>

            <!-- Doctor -->
            <ng-container matColumnDef="doctor">
              <th mat-header-cell *matHeaderCellDef>Assigned Doctor</th>
              <td mat-cell *matCellDef="let patient">
                {{
                  patient.assigned_doctor?.full_name || patient.assigned_doctor
                }}
              </td>
            </ng-container>

            <!-- Status -->
            <ng-container matColumnDef="current_status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let patient">
                {{ patient.current_status }}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class PatientsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'dob', 'gender', 'phone'];
  dataSource = new MatTableDataSource<any>([]);
  search = '';
  form = {
    full_name: '',
    dob: '',
    gender: '',
    assigned_doctor: '',
    contact_info: {
      phone: '',
      email: '',
      address: '',
    },
    emergency_contact: {
      name: '',
      phone: '',
      relation: '',
    },
  };

  loading = false;
  error = '';
  doctors: any[] = [];

  constructor(private receptionistService: ReceptionistService) {}

  ngOnInit() {
    this.loadPatients();
    this.loadDoctors();
  }

  loadPatients() {
    this.loading = true;
    this.error = '';
    this.receptionistService.getPatients().subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data || res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load patients';
        this.loading = false;
      },
    });
  }

  loadDoctors() {
    this.receptionistService.getDoctors().subscribe({
      next: (res: any) => {
        this.doctors = res.data || res; // adjust based on API shape
      },
      error: () => {
        console.error('Failed to load doctors');
      },
    });
  }

  registerPatient() {
    this.loading = true;

    this.receptionistService.registerPatient(this.form).subscribe({
      next: (res: any) => {
        this.dataSource.data = [res.data, ...this.dataSource.data];
        this.form = {
          full_name: '',
          dob: '',
          gender: '',
          assigned_doctor: '',
          contact_info: {
            phone: '',
            email: '',
            address: '',
          },
          emergency_contact: {
            name: '',
            phone: '',
            relation: '',
          },
        };

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      },
    });
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
  }
}
