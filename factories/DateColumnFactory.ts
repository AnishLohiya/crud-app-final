import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateColumnFactory {
  createColumn(col: any): any {
    return {
      ...col,
      filter: 'agDateColumnFilter',
    };
  }
}
