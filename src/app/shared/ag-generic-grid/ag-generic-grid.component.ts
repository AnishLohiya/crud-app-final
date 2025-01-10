import { Component, Input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
// import 'ag-grid-enterprise';

@Component({
  selector: 'app-ag-generic-grid',
  imports: [AgGridAngular],
  templateUrl: './ag-generic-grid.component.html',
  styleUrl: './ag-generic-grid.component.scss'
})
export class AgGenericGridComponent {
  private gridApi!: GridApi<any>;
  @Input() rowData: any[] = [];
  @Input() columnDefs: ColDef[] = [];
  @Input() defaultColDef: ColDef = {};
  @Input() pagination: boolean = true;
  @Input() paginationPageSize: number = 0;
  @Input() paginationPageSizeSelector: number[] = [];

  onBtExport() {
    this.gridApi.exportDataAsExcel();
  }

  onGridReady(event: GridReadyEvent<any>) {
    this.gridApi = event.api
  }

  onCellValueChanged(event: any) {
    console.log('onCellValueChanged: ', event);
  }

}
