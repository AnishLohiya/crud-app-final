import { Component, Inject } from '@angular/core';
import { IEquity } from '../../interfaces/iequity';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { JsonPipe, KeyValuePipe, NgFor, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-populate-data-grid',
  imports: [JsonPipe, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogActions, KeyValuePipe, NgFor, NgIf],
  templateUrl: './populate-data-grid.component.html',
  styleUrl: '../styles.scss',
})
export class PopulateDataGridComponent {
entry: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IEquity[],
    private dialogRef: MatDialogRef<PopulateDataGridComponent>
  ) {}

  keysToDisplay = ['id', 'company_name', 'stock_symbol', 'purchase_date', 'sale_date'];


  closeDialog(): void {
    this.dialogRef.close();
  }
}
