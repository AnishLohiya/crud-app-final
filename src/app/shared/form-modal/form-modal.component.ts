import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-form-modal',
  imports: [
    MatFormFieldModule,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatDialogTitle,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelect,
    NgFor,
    NgIf
  ],
  standalone: true,
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.scss']
})
export class FormModalComponent {
  @Input() formFields: any[] = [];
  @Input() formGroup: FormGroup;
  @Input() isCreateMode: boolean = false;
  @Input() initialValues: any;

  @Output() saveChanges = new EventEmitter();
  @Output() close = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FormModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { formFields: any[]; initialValues: any }
  ) {
    this.formFields = this.data.formFields;
    this.isCreateMode = Object.keys(this.data.initialValues).length === 0;
    this.formGroup = this.createDynamicForm();
  }

  private createDynamicForm(): FormGroup {
    const formControls: { [key: string]: any } = {};
    this.formFields.forEach((field) => {
      console.log('field.name', this.data.initialValues[field.name]),
      formControls[field.name] = [
        this.isCreateMode ? (field.type === 'number' ? 0 : '') : this.data.initialValues[field.name] ?? '',
        field.validators || [],
      ];
    });
    return this.fb.group(formControls);
  }

  onInputChange(event: Event, field: any): void {
    const inputElement = event.target as HTMLInputElement;
    if (field.type === 'number') {
      const value = inputElement.value ? parseFloat(inputElement.value) : null;
      this.formGroup.get(field.name)?.setValue(value, { emitEvent: false });
    }
  }

  save() {
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value); 
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}

