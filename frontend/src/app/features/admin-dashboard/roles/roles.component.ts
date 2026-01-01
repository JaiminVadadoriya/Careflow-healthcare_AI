
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Roles Management</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Define system access levels</p>
        </div>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2">
          <span class="material-icons text-sm">add</span> Add Role
        </button>
      </div>
    
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Role Name</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Description</th>
                <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              @for (role of roles; track role) {
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td class="p-4 font-medium text-gray-900 dark:text-white">{{ role.name }}</td>
                  <td class="p-4 text-gray-600 dark:text-gray-400">{{ role.description }}</td>
                  <td class="p-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button class="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                        <span class="material-icons text-[20px]">edit</span>
                      </button>
                      <button class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                        <span class="material-icons text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
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