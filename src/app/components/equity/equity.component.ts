import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { IEquity } from '../../interfaces/iequity';
import { EquityService } from '../../services/equity/equity.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  ColDef,
  ExcelStyle,
  GridApi,
  GridOptions,
  GridReadyEvent,
  SideBarDef,
  ValueFormatterParams,
  ValueParserParams,
} from 'ag-grid-community';
import { ActionCellRendererComponent } from '../action-cell-renderer/action-cell-renderer.component';
import { FormModalComponent } from '../../shared/form-modal/form-modal.component';
import { equityFormFields } from '../../utils/equityFormFields';
import {
  formatDateToDDMMYYYY,
  formatDateToYYYYMMDD,
} from '../../shared/functions/shared-functions';
import { AgGridAngular } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { marketCapValues } from '../../utils/drop-down/market-cap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MultiCellRenderer } from '../../shared/custom-render/multi-cell.renderer.component';
import { MatChipSet, MatChipsModule } from '@angular/material/chips';
import { MultiSelectComponent } from '../../shared/dropdown/multi-select/multi-select.component';
import { TestComponent } from './test.component';
import OdataProvider from 'ag-grid-odata';

@Component({
  selector: 'app-equity',
  imports: [
    MatDialogModule,
    AgGridAngular,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NgFor,
    MatAutocompleteModule,
    MatChipsModule,
  ],
  templateUrl: './equity.component.html',
  styleUrl: './equity.component.scss',
})
export class EquityComponent {
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
    private http: HttpClient
  ) {}

  colDefs: ColDef[] = [
    {
      field: 'id',
      filter: 'agTextColumnFilter',
      minWidth: 100,
      pinned: 'left',
    },
    {
      field: 'company_name',
      pinned: 'left',
      cellClassRules: {
        redFont: (params) => {
          return params.value === 'Meejo';
        },
        greenBackground: (params) => {
          return params.value === 'Meejo';
        },
      },
    },
    { field: 'stock_symbol', pinned: 'left' },
    {
      field: 'multi_cell',
      cellRenderer: MultiCellRenderer,
      cellEditor: MultiSelectComponent,
      cellEditorParams: {
        values: [],
        cellRender: (params: any) => params.value,
        suppressMultiSelectPillRenderer: true,
      },
      minWidth: 250,
    },
    {
      field: 'purchase_date',
      filter: 'agDateColumnFilter',
    },
    {
      field: 'sale_date',
      filter: 'agDateColumnFilter',
    },
    {
      field: 'stock_name',
    },
    { field: 'stock_sector' },
    {
      field: 'stock_industry',
      cellClass: ['redFont', 'greenBackground'],
    },
    {
      field: 'stock_market_cap',
      cellRenderer: (params: any) => params.data.stock_market_cap,
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        values: marketCapValues,
        cellRender: (params: any) => params.value,
      },
    },
    { field: 'purchase_price' },
    { field: 'sale_price' },
    { field: 'profit' },
    { field: 'quantity' },
    { field: 'dividend_yield' },
    { field: 'earnings_per_share' },
    { field: 'revenue' },
    { field: 'expenses' },
    { field: 'net_income' },
    { field: 'market_price' },
    { field: 'market_capitalization' },
    { field: 'outstanding_shares' },
    { field: 'equity_ratio' },
    { field: 'debt_ratio' },
    { field: 'return_on_equity' },
    { field: 'price_to_earnings_ratio' },
    { field: 'price_to_sales_ratio' },
    { field: 'price_to_book_ratio' },
    { field: 'beta' },
    { field: 'volatility' },
    { field: 'dividend_payout_ratio' },
    {
      headerName: 'Actions',
      cellRenderer: ActionCellRendererComponent,
      cellRendererParams: {
        onEdit: (id: string) => this.updateEquity(id),
        onDelete: (id: string) => this.deleteEquity(id),
      },
      minWidth: 150,
      filter: false,
      editable: false,
    },
  ];

  public excelStyles: ExcelStyle[] = [
    {
      id: 'cell',
      alignment: {
        vertical: 'Center',
      },
    },
    {
      id: 'greenBackground',
    },
    {
      id: 'redFont',
      font: {
        fontName: 'Calibri Light',
        underline: 'Single',
        italic: true,
        color: '#BB0000',
      },
    },
    {
      id: 'darkGreyBackground',
      interior: {
        color: '#888888',
        pattern: 'Solid',
      },
      font: {
        fontName: 'Calibri Light',
        color: '#ffffff',
      },
    },
  ];

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

    rowClassRules: {
      darkGreyBackground: (params) => {
        const id = params.data.id;
        return id === '4926';
      },
    },
    // rowModelType: 'infinite',
    // cacheBlockSize: 100,
    // maxBlocksInCache: 10,
    // cacheOverflowSize: 2,
    // rowBuffer: 50,
  };

  pagination: boolean = true;
  paginationPageSize: number = 50;
  paginationPageSizeSelector: number[] = [50, 100, 200, 500];

  ngOnInit(): void {
    this.loadEquities();
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

  // dataSource = {
  //   getRows: (params: any) => {
  //     this.equityService.getEquities().subscribe({
  //       next: (data: any) => {
  //         console.log('Data:', data);
  //         params.successCallback(data, data.length);
  //       },
  //       error: (err) => {
  //         console.error('Error loading equities', err);
  //       }
  //     });
  //   }
  // };

  onGridReady(params: GridReadyEvent<IEquity>): void {
    this.gridApi = params.api;
    this.setColumnDefs();
  }
  // console.log(this.dataSource);
  // this.gridApi.sizeColumnsToFit();
  // const toolPanelInstance = params.api.getToolPanelInstance('filters');
  // if (toolPanelInstance) {
  //   toolPanelInstance.expandFilters();
  // }

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
}
