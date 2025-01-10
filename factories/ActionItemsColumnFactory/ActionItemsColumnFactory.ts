import { Injectable } from '@angular/core';
import { ColType } from '../../enums/enums';

@Injectable({
    providedIn: 'root',
  })
  export class ActionItemsColumnFactory {
    constructor() {}
  
    bindActionHandlers(colDefData: any[], updateMethod: Function, deleteMethod: Function, context: any) {
      colDefData.forEach((col) => {
        if (col.ColType === ColType.ActionCell) {
          col.onEdit = updateMethod.bind(context);
          col.onDelete = deleteMethod.bind(context);
        }
      });
    }
  }