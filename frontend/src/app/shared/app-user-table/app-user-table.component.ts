import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-user-table',
  templateUrl: './app-user-table.component.html',
  styleUrls: ['./app-user-table.component.scss'],
  imports: [CommonModule, MatTableModule, MatIconModule],
})
export class AppUserTableComponent implements OnInit {
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  @Output() editUser = new EventEmitter<any>();
  @Output() toggleStatus = new EventEmitter<any>();
  @Output() promoteUser = new EventEmitter<any>();
  displayedColumns: string[] = [];

  ngOnInit() {
    this.displayedColumns = [...this.columns, 'actions'];
  }
}
