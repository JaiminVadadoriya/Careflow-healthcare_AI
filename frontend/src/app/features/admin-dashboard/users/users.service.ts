import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
    appUrl = '/users';
  constructor(private appService: AppService, private router: Router) {}
  getUsers() {
    return this.appService.getData(this.appUrl);
  }
  updateUser(id: string, data: any) {
    return this.appService.putData(`${this.appUrl}/${id}`, data);
  }

  updateUserStatus(id: string, status: 'active' | 'inactive') {
    return this.appService.putData(`${this.appUrl}/${id}/status`, { status });
  }

  updateUserRole(id: string, role: string) {
    return this.appService.putData(`${this.appUrl}/${id}/role`, { role });
  }

  createUser(data: any) {
    return this.appService.postData(this.appUrl, data);
  }

  deleteUser(id: string) {
    return this.appService.deleteData(`${this.appUrl}/${id}`);
  }
}
