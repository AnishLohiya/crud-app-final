import { Injectable } from '@angular/core';
import { ColType } from '../../enums/enums';
import { ActionItemsColumnFactory, DateColumnFactory, NumberColumnFactory, SingleCellColumnFactory, MultiCellColumnFactory, TextColumnFactory } from '../index'
@Injectable({
  providedIn: 'root',
})
export class ColumnFactory {
  private factories: { [key in ColType]?: any } = {};

  constructor(
    private actionItemsFactory: ActionItemsColumnFactory,
    private dateColumnFactory: DateColumnFactory,
    private numberColumnFactory: NumberColumnFactory,
    private singleCellColumnFactory: SingleCellColumnFactory,
    private multiCellColumnFactory: MultiCellColumnFactory,
    private textColumnFactory: TextColumnFactory
  ) {
    this.factories[ColType.ActionCell] = this.actionItemsFactory;
    this.factories[ColType.DateCell] = this.dateColumnFactory;
    this.factories[ColType.NumberCell] = this.numberColumnFactory;
    this.factories[ColType.SingleCell] = this.singleCellColumnFactory;
    this.factories[ColType.MultiCell] = this.multiCellColumnFactory; 
    this.factories[ColType.TextCell] = this.textColumnFactory;
  }

  public createColumns(colDefData: any[]): any[] {
    return colDefData.map((col) => this.createColumn(col));
  }

  public createColumn(col: { ColType: ColType }): any {
    const factory = this.factories[col.ColType];
    if (factory && factory.createColumn) {
      return factory.createColumn(col);
    }
    console.warn(`No factory found for column type: ${col.ColType}`);
    return this.createDefaultColumn(col);
  }

  private createDefaultColumn(col: any): any {
    return col;
  }
}
