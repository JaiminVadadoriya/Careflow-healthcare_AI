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
