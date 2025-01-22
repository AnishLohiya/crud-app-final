import { Injectable } from '@angular/core';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TextColumnFactory  {
  createColumn(col: any): any {
    return {
      ...col,
      // filter: 'agTextColumnFilter',
    };
  }
}
