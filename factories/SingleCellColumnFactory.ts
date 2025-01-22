import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SingleCellColumnFactory {
  createColumn(col: any): any {
    return {
      ...col,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        values: col.values,
        cellRender: (params: any) => params.value,
      },
    };
  }
}