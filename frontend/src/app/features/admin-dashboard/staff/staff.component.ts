import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-staff',
  standalone: true,
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Staff Management</h2>
      <div class="bg-white p-4 rounded shadow">
        <p>Staff management and scheduling coming soon...</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StaffComponent {} 