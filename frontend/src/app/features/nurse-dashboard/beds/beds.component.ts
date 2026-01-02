import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NurseService } from '../nurse.service';
import { ModalService } from 'src/app/shared/ui/modal.service';
import { AssignBedDialogComponent } from './assign-bed-dialog.component';

@Component({
  selector: 'app-nurse-beds',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Bed Management</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Track occupancy and assign beds</p>
        </div>
        <button (click)="openAddBedDialog()" class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium shadow-sm shadow-blue-500/20">
            <span class="material-icons text-sm">add</span>
            Add Bed
        </button>
      </div>
    
      <!-- Loading -->
      @if (loading) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    
      <!-- Grid Layout for Beds -->
      @if (!loading) {
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
           @for (bed of beds; track bed) {
              <div class="relative group bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-300 overflow-hidden hover:shadow-lg"
                   [ngClass]="{
                     'border-red-100 dark:border-red-900/30': bed.is_occupied,
                     'border-green-100 dark:border-green-900/30': !bed.is_occupied
                   }">
                  
                  <!-- Status Indicator Strip -->
                  <div class="h-2 w-full"
                    [ngClass]="{
                        'bg-red-500': bed.is_occupied,
                        'bg-green-500': !bed.is_occupied
                    }"></div>

                  <div class="p-5 flex flex-col items-center text-center space-y-3">
                      <!-- Bed Icon -->
                      <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                           [ngClass]="{
                             'bg-red-50 text-red-500 dark:bg-red-900/20': bed.is_occupied,
                             'bg-green-50 text-green-500 dark:bg-green-900/20': !bed.is_occupied
                           }">
                          <span class="material-icons">bed</span>
                      </div>

                      <div>
                          <h3 class="font-bold text-gray-900 dark:text-white text-lg">Bed {{ bed.room_number || bed._id }}</h3>
                          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">{{ bed.ward }}</p>
                          @if (bed.is_occupied) {
                              <p class="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                Assigned by: {{ bed.assigned_by?.full_name || 'System' }}
                              </p>
                          }
                      </div>

                      <div class="pt-2 w-full">
                          @if (!bed.is_occupied) {
                             <button (click)="openAssignDialog(bed)" 
                                     [disabled]="loadingMap[bed._id]"
                                     class="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50">
                                {{ loadingMap[bed._id] ? 'Assigning...' : 'Assign Patient' }}
                             </button>
                          } @else {
                             <button (click)="confirmRelease(bed)" 
                                     [disabled]="loadingMap[bed._id]"
                                     class="w-full py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 font-medium text-sm transition-colors disabled:opacity-50">
                                {{ loadingMap[bed._id] ? 'Releasing...' : 'Release Bed' }}
                             </button>
                          }
                      </div>
                  </div>
              </div>
           }
        </div>

        @if (beds.length === 0) {
            <div class="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <span class="material-icons text-gray-400 text-6xl mb-4">bed</span>
                <p class="text-gray-500 font-medium mb-4">No beds found in the system.</p>
                <button (click)="openAddBedDialog()" class="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                    Add Your First Bed
                </button>
            </div>
        }
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

  openAddBedDialog() {
      // Lazy load approach not needed since it's standalone, but we need to import it
      import('./add-bed-dialog.component').then(c => {
          const ref = this.modalService.open(c.AddBedDialogComponent, {});
          ref.afterClosed().subscribe(result => {
              if (result) {
                  this.loading = true;
                  this.nurseService.createBed(result).subscribe({
                      next: () => this.loadBeds(),
                      error: (err) => {
                          this.loading = false;
                          alert(err?.error?.message || 'Failed to create bed');
                      }
                  });
              }
          });
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
                this.loadBeds(); // Reload to get updated user info
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
            this.loadBeds(); // Reload to clear user info
         },
         error: () => {
            alert('Failed to release bed');
            this.loadingMap[bed._id] = false;
         }
      });
  }
}
