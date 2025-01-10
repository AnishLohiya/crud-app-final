import { Validators } from "@angular/forms";

export const olympicDataFormFields = [
    { name: 'athlete', label: 'Athlete', type: 'text', validators: [Validators.required], },
    { name: 'country', label: 'Country', type: 'text', validators: [Validators.required] },
    { name: 'sport', label: 'Sport', type: 'text', validators: [Validators.required] },
    { name: 'age', label: 'Age', type: 'number', validators: [Validators.required] },
    { name: 'year', label: 'Year', type: 'number', validators: [Validators.required, Validators.min(1900)] },
    { name: 'date', label: 'Date', type: 'date', validators: [Validators.required] },
    { name: 'gold', label: 'Gold Medals', type: 'number', validators: [Validators.required] },
    { name: 'silver', label: 'Silver Medals', type: 'number', validators: [Validators.required] },
    { name: 'bronze', label: 'Bronze Medals', type: 'number', validators: [Validators.required] },
    { name: 'total', label: 'Total Medals', type: 'number', validators: [Validators.required] },
  ];
  