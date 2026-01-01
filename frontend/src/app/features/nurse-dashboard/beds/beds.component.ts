import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NurseService } from '../nurse.service';
import { ModalService } from 'src/app/shared/ui/modal.service';
import { AssignBedDialogComponent } from './assign-bed-dialog.component';

@Component({
  selector: 'app-nurse-beds',
  standalone: true,
  imports: [
    FormsModule
],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Bed Management</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Track occupancy and assign beds</p>
        </div>
      </div>
    
      <!-- Loading -->
      @if (loading) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    
      <!-- Grid Layout for Beds (Better than table for visuals maybe?) - Keeping Table for consistency as requested generally, but Grid is nice for beds. Let's use Table as Refactor. -->
      @if (!loading) {
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead class="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Bed #</th>
                  <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Ward</th>
                  <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Type</th>
                  <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Status</th>
                  <th class="p-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                @for (bed of beds; track bed) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td class="p-4 font-bold text-gray-900 dark:text-white">#{{ bed._id }}</td>
                    <td class="p-4 text-gray-600 dark:text-gray-400">{{ bed.ward }}</td>
                    <td class="p-4 text-gray-600 dark:text-gray-400">{{ bed.bed_type }}</td>
                    <td class="p-4">
                     <span [class]="'px-2.5 py-1 rounded-full text-xs font-medium border ' + 
                       (bed.is_occupied 
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' 
                          : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800')">
                        {{ bed.is_occupied ? 'Occupied' : 'Avaliable' }}
                      </span>
                    </td>
                    <td class="p-4 text-right">
                      @if (!bed.is_occupied) {
                        <button
                          (click)="openAssignDialog(bed)"
                          [disabled]="loadingMap[bed._id]"
                          class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 min-w-[80px]"
                          >
                          {{ loadingMap[bed._id] ? '...' : 'Assign' }}
                        </button>
                      }
                      @if (bed.is_occupied) {
                        <button
                          (click)="confirmRelease(bed)"
                          [disabled]="loadingMap[bed._id]"
                          class="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 min-w-[80px]"
                          >
                          {{ loadingMap[bed._id] ? '...' : 'Release' }}
                        </button>
                      }
                    </td>
                  </tr>
                }
                @if (beds.length === 0) {
                  <tr>
                    <td colspan="5" class="p-8 text-center text-gray-500 dark:text-gray-400">No beds found.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
    `
})
export class BedsComponent implements OnInit {
  beds: any[] = [];
  loading = false;
  loadingMap: { [key: string]: boolean } = {};

  constructor(
    private nurseService: NurseService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadBeds();
  }

  loadBeds() {
    this.loading = true;
    this.nurseService.getAllBeds().subscribe({
      next: (res: any) => {
        this.beds = res.data || res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openAssignDialog(bed: any) {
    const ref = this.modalService.open(AssignBedDialogComponent, {});
    ref.afterClosed().subscribe((patientId: any) => {
       if (patientId) {
          this.loadingMap[bed._id] = true;
          this.nurseService.assignOrReleaseBed({ bedId: bed._id, patientId, action: 'assign' }).subscribe({
             next: () => {
                bed.is_occupied = true;
                this.loadingMap[bed._id] = false;
             },
             error: () => {
                alert('Failed to assign bed');
                this.loadingMap[bed._id] = false;
             }
          });
       }
    });
  }

  confirmRelease(bed: any) {
      if (!confirm(`Confirm release for Bed #${bed._id}?`)) return;

      this.loadingMap[bed._id] = true;
      this.nurseService.assignOrReleaseBed({ bedId: bed._id, action: 'release' }).subscribe({
         next: () => {
            bed.is_occupied = false;
            this.loadingMap[bed._id] = false;
         },
         error: () => {
            alert('Failed to release bed');
            this.loadingMap[bed._id] = false;
         }
      });
  }
}
