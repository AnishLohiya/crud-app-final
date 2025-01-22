import { Component, EventEmitter, Output } from '@angular/core';
import { IEquity } from '../../interfaces/iequity';
import { EquityService } from '../../services/equity/equity.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  ColDef,
  GetContextMenuItems,
  GetContextMenuItemsParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  MenuItemDef,
  SideBarDef,
  ValueFormatterParams,
  ValueParserParams,
} from 'ag-grid-community';
import { FormModalComponent } from '../../shared/form-modal/form-modal.component';
import { equityFormFields } from '../../utils/form-fields/equityFormFields';
import {
  formatDateToDDMMYYYY,
  formatDateToYYYYMMDD,
} from '../../shared/functions/shared-functions';
import { AgGridAngular } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import {
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { TestComponent } from '../equity/test.component';
import { ColumnFactory } from '../../../../factories/ColumnFactory/ColumnFactory';
import { ActionItemsColumnFactory } from '../../../../factories/ActionItemsColumnFactory';
import 'ag-grid-enterprise';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { PopulateDataGridComponent } from '../../shared/populate-data-grid/populate-data-grid.component';

@Component({
  selector: 'app-custom',
  imports: [
    MatDialogModule,
    AgGridAngular,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    NavbarComponent
  ],
  templateUrl: './custom.component.html',
  styleUrl: './custom.component.scss',
})
export class CustomComponent {
  equities: IEquity[] = [];
  public gridApi!: GridApi<IEquity>;
  presetList: {
    name: string;
    state: { filterModel: any; columnState: any[] };
  }[] = [];
  colDefData = [];
  filteredList: any[] = [];

  constructor(
    private equityService: EquityService,
    private dialog: MatDialog,
    private http: HttpClient,
    private columnFactory: ColumnFactory,
    private actionsItemsColumnFactory: ActionItemsColumnFactory
  ) {}

  columnTypes = {
    headerAlignLeft: {
      headerClass: 'header-align-left',
    },
    headerAlignCenter: {
      headerClass: 'header-align-center',
    },
    headerAlignRight: {
      headerClass: 'header-align-right',
    },
  };

  colDefs: ColDef[] = [];

  valueFormatter = (params: ValueFormatterParams) => {
    const { value } = params;
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  };

  valueParser = (params: ValueParserParams) => {
    const { newValue } = params;
    if (newValue == null || newValue === '') {
      return null;
    }
    return params.newValue.split(',');
  };

  defaultColDef: ColDef = {
    resizable: true,
    filter: true,
    floatingFilter: true,
    editable: true,
    valueFormatter: this.valueFormatter,
    valueParser: this.valueParser,
  };

  gridOptions: GridOptions = {
    onCellValueChanged: (params) => {
      const selectedNodes = params.api.getSelectedNodes();
      selectedNodes.forEach((node) => {
        if (node !== params.node) {
          node.setDataValue(params.column.getId(), params.newValue);
          console.log('Selected Nodes:', selectedNodes);
        }
      });
      this.equityService.updateEquity(params.data.id, params.data).subscribe({
        next: () => {
          this.loadEquities();
        },
        error: (err) => {
          console.error('Error updating equity', err);
        },
      });
    },
    rowSelection: {
      mode: 'multiRow',
    },
    selectionColumnDef: {
      pinned: 'left',
    },
    suppressPropertyNamesCheck: true,
    columnTypes: this.columnTypes,
    suppressServerSideFullWidthLoadingRow: true,
  };

  pagination: boolean = true;
  paginationPageSize: number = 50;
  paginationPageSizeSelector: number[] = [50, 100, 200, 500];

  ngOnInit(): void {
    this.loadEquities();
    this.loadColDefs();
  }

  loadColDefs() {
    this.http.get('http://localhost:3001/colConfig').subscribe({
      next: (data: any) => {
        this.colDefData = data;
        this.actionsItemsColumnFactory.bindActionHandlers(
          this.colDefData,
          this.updateEquity,
          this.deleteEquity,
          this
        );
        this.createColumnDefs();
      },
      error: (err) => {
        console.error('Error loading column definitions', err);
      },
    });
  }

  createColumnDefs() {
    console.log('Column Def Data:', this.colDefData);
    this.colDefs = this.columnFactory.createColumns(this.colDefData);
  }

  loadEquities() {
    this.equityService.getEquities().subscribe({
      next: (equities: IEquity[]) => {
        this.equities = equities;
      },
      error: (err) => {
        console.error('Error loading equities', err);
      },
    });
  }

  // Preset Functions

  onPresetApplied(presetState: { filterModel: any; columnState: any[] }): void {
    console.log('Preset Applied:', presetState);
  }

  public getFilterModel(): any {
    return this.gridApi.getFilterModel();
  }

  public getColumnState(): any[] {
    return this.gridApi.getColumnState();
  }

  public setFilterModel(filterModel: any): void {
    this.gridApi.setFilterModel(filterModel);
  }

  public applyColumnState(columnState: any[]): void {
    this.gridApi.applyColumnState({
      state: columnState,
      applyOrder: true,
    });
  }

  clearFilters() {
    this.gridApi.setFilterModel(null);
    this.gridApi.resetColumnState();
  }

  onCsvExport() {
    this.gridApi.exportDataAsCsv();
  }

  onExcelExport() {
    this.gridApi.exportDataAsExcel();
  }

  public sideBar: SideBarDef | string | string[] | boolean | null = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Column Chooser',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      },
      {
        id: 'customStats',
        labelDefault: 'Preset Panel',
        labelKey: 'customStats',
        iconKey: 'custom-stats',
        toolPanel: TestComponent,
        toolPanelParams: {
          title: 'Present Panel',
        },
      },
    ],
    defaultToolPanel: 'columns',
    hiddenByDefault: false,
  };

  onGridReady(params: GridReadyEvent<IEquity>) {
    this.gridApi = params.api;
    this.setColumnDefs();
  }

  openCreateModal() {
    const dialogRef = this.dialog.open(FormModalComponent, {
      data: {
        formFields: equityFormFields,
        initialValues: {},
      },
    });

    dialogRef.afterClosed().subscribe((result: IEquity) => {
      const purchase_date = formatDateToDDMMYYYY(result.purchase_date);
      const sale_date = formatDateToDDMMYYYY(result.sale_date);
      result = { ...result, purchase_date, sale_date };
      if (result) {
        this.equityService.createEquity(result).subscribe({
          next: () => this.loadEquities(),
          error: (err) => console.error(err),
        });
      }
    });
  }

  updateEquity(id: string) {
    this.equityService.getEquityById(id).subscribe({
      next: (equity: IEquity) => {
        const dialogRef = this.dialog.open(FormModalComponent, {
          data: {
            formFields: equityFormFields,
            initialValues: {
              ...equity,
              purchase_date: formatDateToYYYYMMDD(equity.purchase_date),
              sale_date: formatDateToYYYYMMDD(equity.sale_date),
            },
          },
        });
        dialogRef.afterClosed().subscribe((result: IEquity) => {
          const purchase_date = formatDateToDDMMYYYY(result.purchase_date);
          const sale_date = formatDateToDDMMYYYY(result.sale_date);
          result = { ...result, purchase_date, sale_date };
          if (result) {
            this.equityService.updateEquity(id, result).subscribe({
              next: () => {
                this.loadEquities();
              },
              error: (err) => {
                console.error('Error updating equity', err);
              },
            });
          }
        });
      },
      error: (err) => {
        console.error('Error loading equity', err);
      },
    });
  }

  deleteEquity(id: string) {
    this.equityService.deleteEquity(id).subscribe({
      next: () => {
        this.loadEquities();
      },
      error: (err) => {
        console.error('Error deleting equity', err);
      },
    });
  }

  setColumnDefs() {
    const columnIds = this.gridApi
      .getAllGridColumns()
      .map((col) => col.getId());
    this.gridApi.autoSizeColumns(columnIds, false);
  }

  getContextMenuItems = (params: GetContextMenuItemsParams): (string | MenuItemDef)[] => {
    const result: (string | MenuItemDef)[] = [
      {
        name: "Actions",
        action: () => {
          if (params.node) {
            const rowData = params.node.data;
            console.log('Row Data:', rowData);
            const rowNodeData = JSON.stringify(rowData);
            this.dialog.open(PopulateDataGridComponent, {
              data: rowData,
              width: '1000px',
              height: '600px',
            });
          }
        },
      },
      'copy',
      'paste',
      'export',
      'separator',
      'copyWithHeaders',
    ];
    return result;
  };
  
}
