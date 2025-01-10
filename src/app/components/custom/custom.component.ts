import { Component } from '@angular/core';
import { IEquity } from '../../interfaces/iequity';
import { EquityService } from '../../services/equity/equity.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  SideBarDef,
  ValueFormatterParams,
  ValueParserParams,
} from 'ag-grid-community';
import { FormModalComponent } from '../../shared/form-modal/form-modal.component';
import { equityFormFields } from '../../utils/equityFormFields';
import {
  formatDateToDDMMYYYY,
  formatDateToYYYYMMDD,
} from '../../shared/functions/shared-functions';
import { AgGridAngular } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgForOf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { TestComponent } from '../equity/test.component';
import { ColumnFactory } from '../../../../factories/ColumnFactory/ColumnFactory';
import { ActionItemsColumnFactory } from '../../../../factories/ActionItemsColumnFactory/ActionItemsColumnFactory';
import OdataProvider from 'ag-grid-odata'

@Component({
  selector: 'app-equity',
  imports: [
    MatDialogModule,
    AgGridAngular,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    NgForOf
  ],
  templateUrl: './custom.component.html',
  styleUrl: './custom.component.scss',
})
export class CustomComponent {
  equities: IEquity[] = [];
  private gridApi!: GridApi<IEquity>;
  selectedCol: string = '';
  jsonFilePath: string = 'presets.json';
  filtersList: {
    name: string;
    state: { filterModel: any; columnState: any[] };
  }[] = [];
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
    columnTypes: {},
  };

  pagination: boolean = true;
  paginationPageSize: number = 50;
  paginationPageSizeSelector: number[] = [50, 100, 200, 500];

  ngOnInit(): void {
    this.loadEquities();
    this.loadColDefs();
    this.loadPresets();
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

  showColumnChooser() {
    this.gridApi.showColumnChooser();
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

  clearFilters() {
    this.gridApi.setFilterModel(null);
    this.gridApi.resetColumnState();
    document.getElementsByTagName('select')[0].selectedIndex = 0;
  }

  filteredList: any[] = [];

  onSearchColumn(event: Event) {
    const searchCol = (event.target as HTMLInputElement).value;

    const cols = this.gridApi.getAllGridColumns();
    this.filteredList = cols.filter((col) =>
      col.getColId().toLowerCase().includes(searchCol.toLowerCase())
    );
  }

  onColumnSelected(event: MatAutocompleteSelectedEvent) {
    const selectedColumn = event.option.value;
    console.log('Selected Column:', selectedColumn);

    this.gridApi.ensureColumnVisible(selectedColumn, 'start');

    const column = this.gridApi.getColumnDef(selectedColumn);
    console.log('Column:', column);
    if (column) {
      column.cellClass = 'highlight-column';

      setTimeout(() => {
        column.cellClass = '';
        this.gridApi.refreshCells({ force: true });
      }, 1000);
      this.gridApi.refreshCells({ force: true });
    }
  }

  loadPresets() {
    this.http.get('http://localhost:8000/presets').subscribe({
      next: (data: any) => {
        this.filtersList = data;
      },
      error: (err) => {
        console.error('Error loading presets', err);
      },
    });
  }

  saveFilterModel() {
    const filterModel = this.gridApi.getFilterModel();
    const columnState = this.gridApi.getColumnState();

    if (Object.keys(filterModel).length > 0 || columnState.length > 0) {
      const filterName = prompt('Enter a name for the filter:');
      if (filterName) {
        const newPreset = {
          name: filterName,
          state: { filterModel, columnState },
        };
        this.http.post('http://localhost:8000/presets', newPreset).subscribe({
          next: () => {
            this.filtersList.push(newPreset);
            this.clearFilters();
          },
          error: (err) => {
            console.error('Error saving filter', err);
          },
        });
      }
    } else {
      alert('No filters to save.');
    }
  }

  applySavedFilter(event: Event) {
    const name = (event.target as HTMLSelectElement).value;

    const selectedFilter = this.filtersList.find(
      (filter) => filter.name === name
    );

    if (selectedFilter) {
      this.gridApi.setFilterModel(selectedFilter.state.filterModel);
      this.gridApi.applyColumnState({
        state: selectedFilter.state.columnState,
        applyOrder: true,
      });
    }
  }


  colDefData = [];

  loadColDefs() {
    this.http.get('http://localhost:3001/colConfig').subscribe({
      next: (data: any) => {
        this.colDefData = data;
        this.actionsItemsColumnFactory.bindActionHandlers(this.colDefData, this.updateEquity, this.deleteEquity, this);
        this.createColumnDefs();
      },
      error: (err) => {
        console.error('Error loading column definitions', err);
      },
    });
  }

  createColumnDefs() {
    this.colDefs = this.columnFactory.createColumns(this.colDefData);
  }
  
}
