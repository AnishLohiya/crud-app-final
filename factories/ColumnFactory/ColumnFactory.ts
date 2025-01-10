import { Injectable } from '@angular/core';
import { ColType } from '../../enums/enums';
import { ActionCellRendererComponent } from '../../src/app/components/action-cell-renderer/action-cell-renderer.component';
import { MultiCellRenderer } from '../../src/app/shared/custom-render/multi-cell.renderer.component';
import { MultiSelectComponent } from '../../src/app/shared/dropdown/multi-select/multi-select.component';

@Injectable({
  providedIn: 'root',
})
export class ColumnFactory {
  public createColumns(colDefData: any[]): any[] {
    const columnDefinitions: any[] = [];

    colDefData.forEach((col) => {
      const colDef = this.createColumn(col);

      columnDefinitions.push(colDef);
    });
    console.log(columnDefinitions);
    return [...columnDefinitions];
  }

  public createColumn(col: any): any {
    switch (col.ColType) {
      case ColType.MultiCell:
        return this.createMultiCellColumn(col);
      case ColType.SingleCell:
        return this.createSingleCellColumn(col);
      case ColType.ActionCell:
        return this.createActionCellColumn(col);
      case ColType.TextCell:
        return this.createTextCellColumn(col);
      case ColType.NumberCell:
        return this.createNumberColumn(col);
      case ColType.DateCell:
        return this.createDateColumn(col);
      default:
        return this.createDefaultColumn(col);
    }
  }

  private createMultiCellColumn(col: any): any {
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

  private createSingleCellColumn(col: any): any {
    return {
      ...col,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        values: col.values,
        cellRender: (params: any) => params.value,
      },
    };
  }

  private createActionCellColumn(col: any): any {
    return {
      ...col,
      cellRenderer: ActionCellRendererComponent,
      cellRendererParams: {
        onEdit: (id: string) => col.onEdit(id),
        onDelete: (id: string) => col.onDelete(id),
      },
    };
  }

  private createTextCellColumn(col: any): any {
    return {
      ...col,
      filter: 'agTextCellEditor',
    };
  }

  private createNumberColumn(col: any): any {
    return {
      ...col,
      filter: 'agNumberCellEditor',
    };
  }

  private createDateColumn(col: any): any {
    return {
      ...col,
      filter: 'agDateCellEditor',
    };
  }

  private createDefaultColumn(col: any): any {
    return col;
  }
}
