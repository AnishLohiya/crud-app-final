import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NumberColumnFactory {
  createColumn(col: any): any {
    return {
      ...col,
      cellClassRules: {
        redFont: (params: any) => {
          return params.value < 0;
        },
        greenFont: (params: any) => {
          return params.value > 0;
        },
      },
    };
  }
}
