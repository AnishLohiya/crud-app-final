import { Validators } from "@angular/forms";

export const productFormFields = [
    { name: 'title', label: 'Title', type: 'text', errorMessage: 'Title is required', validators: [Validators.required] },
    { name: 'price', label: 'Price', type: 'number', errorMessage: 'Must be a number', validators: [Validators.required, Validators.min(0)] },
    { name: 'description', label: 'Description', type: 'text' },
    { name: 'category', label: 'Category', type: 'text' }
  ];
  
  