import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private baseUrl = '/users/reports';

  constructor(private appService: AppService) {}

  getDashboardReports() {
    return this.appService.getData(`${this.baseUrl}/dashboard`);
  }

  getUserReports(params?: any) {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.appService.getData(`${this.baseUrl}/users${queryParams}`);
  }

  getAppointmentReports(params?: any) {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.appService.getData(`${this.baseUrl}/appointments${queryParams}`);
  }

  getInventoryReports(params?: any) {
    const queryParams = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.appService.getData(`${this.baseUrl}/inventory${queryParams}`);
  }
} 