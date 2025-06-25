import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-user-table',
  templateUrl: './app-user-table.component.html',
  styleUrls: ['./app-user-table.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule]
})
export class AppUserTableComponent implements OnInit {
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  displayedColumns: string[] = [];

ngOnInit() {
  this.displayedColumns = [...this.columns, 'actions'];
}
} 