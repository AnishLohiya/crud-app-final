import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ICellRenderer } from 'ag-grid-community';

@Component({
  selector: 'app-action-cell-renderer',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button mat-icon-button color="primary" (click)="onEditClick()">
      <mat-icon aria-hidden="false" aria-label="Edit">edit</mat-icon>
    </button>
    <button mat-icon-button color="warn" (click)="onDeleteClick()">
      <mat-icon aria-hidden="false" aria-label="Delete">delete</mat-icon>
    </button>
  `,
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
