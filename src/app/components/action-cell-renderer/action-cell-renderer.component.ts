import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ICellRenderer } from 'ag-grid-community';

@Component({
  selector: 'app-action-cell-renderer',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './action-cell-renderer.component.html',
  styleUrl: './action-cell-renderer.component.scss'
})
export class ActionCellRendererComponent implements ICellRenderer {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return true;
  }

  onEditClick(): void {
    if (this.params.onEdit) {
      const recordId = this.params.data.id; 
      this.params.onEdit(recordId);
    }
  }

  onDeleteClick(): void {
    if (this.params.onDelete) {
      const recordId = this.params.data.id;
      this.params.onDelete(recordId);
    }
  }
  
}