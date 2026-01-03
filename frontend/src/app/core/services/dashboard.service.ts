import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private appService: AppService) {}

  getAdminStats(): Observable<any> {
    return this.appService.getData('/dashboard/admin');
  }

  // Admin Features
  getActivityLogs(): Observable<any> {
    return this.appService.getData('/admin/activity-logs');
  }

  getSettings(): Observable<any> {
    return this.appService.getData('/admin/settings');
  }

  updateSetting(data: {key: string, value: any}): Observable<any> {
    return this.appService.postData('/admin/settings', data);
  }

  getAllUsers(): Observable<any> {
    return this.appService.getData('/admin/users');
  }

  // Deprecated? Or move to specific services? Keeping here for now as they are dashboard-centric
  getDoctorStats(): Observable<any> {
    return this.appService.getData('/dashboard/doctor');
  }

  getNurseStats(): Observable<any> {
    return this.appService.getData('/dashboard/nurse');
  }

  getReceptionistStats(): Observable<any> {
    return this.appService.getData('/dashboard/receptionist');
  }
}
