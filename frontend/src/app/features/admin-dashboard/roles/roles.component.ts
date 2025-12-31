import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Roles Management</h2>
      <table class="min-w-full bg-white border border-gray-200 rounded">
        <thead>
          <tr>
            <th class="px-4 py-2 border-b">Role</th>
            <th class="px-4 py-2 border-b">Description</th>
            <th class="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let role of roles">
            <td class="px-4 py-2 border-b">{{ role.name }}</td>
            <td class="px-4 py-2 border-b">{{ role.description }}</td>
            <td class="px-4 py-2 border-b">
              <button mat-icon-button color="primary"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn"><mat-icon>delete</mat-icon></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent {
  roles = [
    { name: 'Admin', description: 'Full access to all modules' },
    { name: 'Doctor', description: 'Manage patients and appointments' },
    { name: 'Nurse', description: 'Manage patient care and vitals' },
    { name: 'Receptionist', description: 'Patient registration and appointments' },
    { name: 'Inventory', description: 'Manage inventory and stock' },
    { name: 'Lab', description: 'Manage lab results' },
    { name: 'Patient', description: 'Access personal health data' }
  ];
} 