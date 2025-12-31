import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Appointments Management</h2>
      <div class="bg-white p-4 rounded shadow">
        <p>Appointments management and scheduling coming soon...</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointmentsComponent {} 