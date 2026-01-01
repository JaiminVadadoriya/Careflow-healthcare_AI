import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-user-table',
  templateUrl: './app-user-table.component.html',
  styleUrls: ['./app-user-table.component.scss'],
  imports: [CommonModule],
  standalone: true // Making it standalone to fix imports from SharedModule potentially
})
export class AppUserTableComponent implements OnInit {
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  @Output() editUser = new EventEmitter<any>();
  @Output() toggleStatus = new EventEmitter<any>();
  @Output() promoteUser = new EventEmitter<any>();
  
  ngOnInit() {
  }
}
