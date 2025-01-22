import { Injectable } from '@angular/core';
import { ColType } from '../enums/enums';
import { ActionCellRendererComponent } from '../src/app/shared/renders';

@Injectable({
    providedIn: 'root',
  })
  export class ActionItemsColumnFactory {
    constructor() {}

    createColumn(col: any): any {
      return {
        ...col,
        cellRenderer: ActionCellRendererComponent,
        cellRendererParams: {
          onEdit: col.onEdit,
          onDelete: col.onDelete,
        },
      };
    }
  
    bindActionHandlers(colDefData: any[], updateMethod: Function, deleteMethod: Function, context: any) {
      colDefData.forEach((col) => {
        if (col.ColType === ColType.ActionCell) {
          col.onEdit = updateMethod.bind(context);
          col.onDelete = deleteMethod.bind(context);
        }
      });
    }
  }