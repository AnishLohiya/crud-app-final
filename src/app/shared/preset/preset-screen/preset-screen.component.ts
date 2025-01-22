import { NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-preset-screen',
  imports: [NgFor],
  templateUrl: './preset-screen.component.html',
  styleUrl: './styles.scss',
})
export class PresetScreenComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PresetScreenComponent>
  ) {}

  displayedColumns: string[] = [
    'id',
    'name',
    // 'filterModel',
    'username',
    'actions',
  ];

  applyPreset(preset: any): void {
    this.dialogRef.close(preset);
  }

  close(): void {
    this.dialogRef.close();
  }
}
