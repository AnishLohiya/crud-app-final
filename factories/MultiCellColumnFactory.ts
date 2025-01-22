import { Injectable } from '@angular/core';
import { MultiCellRenderer } from '../src/app/shared/renders';
import { MultiSelectComponent } from '../src/app/shared/dropdown/multi-select/multi-select.component';

@Injectable({
  providedIn: 'root',
})
export class MultiCellColumnFactory {
  createColumn(col: any): any {
    return {
      ...col,
      cellRenderer: MultiCellRenderer,
      cellEditor: MultiSelectComponent,
      cellEditorParams: {
        values: col.values,
        cellRender: (params: any) => params.value,
      },
    };
  }
}
