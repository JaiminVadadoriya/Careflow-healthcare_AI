import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private baseUrl = '/inventory';

  constructor(private appService: AppService) {}

  getInventoryList() {
    return this.appService.getData(this.baseUrl);
  }

  getInventoryItem(itemId: string) {
    return this.appService.getData(`${this.baseUrl}/${itemId}`);
  }

  addInventoryItem(data: any) {
    return this.appService.postData(this.baseUrl, data);
  }

  updateInventoryItem(itemId: string, data: any) {
    return this.appService.patchData(`${this.baseUrl}/${itemId}`, data);
  }

  deleteInventoryItem(id: string) {
    return this.appService.deleteData(`${this.baseUrl}/${id}`);
  }

  consumeStock(itemId: string, data: { quantity: number, reason?: string }) {
    return this.appService.postData(`${this.baseUrl}/consume/${itemId}`, data);
  }

  getLowStockItems() {
    return this.appService.getData(`${this.baseUrl}/low-stock`);
  }
} 