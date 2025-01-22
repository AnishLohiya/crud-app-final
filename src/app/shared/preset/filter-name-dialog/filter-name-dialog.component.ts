import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-filter-name-dialog',
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './filter-name-dialog.component.html',
  styleUrls: ['./styles.scss']
})
export class FilterNameDialogComponent {
  filterName: string = '';

  constructor(public dialogRef: MatDialogRef<FilterNameDialogComponent>) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.filterName) {
      this.dialogRef.close(this.filterName);
    } else {
      alert('Please enter a filter name.');
    }
  }
}
