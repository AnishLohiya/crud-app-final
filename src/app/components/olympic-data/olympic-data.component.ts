import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
// import 'ag-grid-enterprise';
import { saveAs } from 'file-saver';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { IOlympicData } from '../../interfaces/iolympic-data';
import { filter } from 'rxjs';

@Component({
  selector: 'app-olympic-data',
  imports: [AgGridAngular],
  template: `
    <div class="container">
      <input
        hidden
        type="file"
        id="file"
        #file
        (change)="importExcel($event)"
      />
      <button (click)="file.click()">Import Excel</button>
      <button (click)="exportToJson()">Export to JSON</button>
      <button [disabled]="!isValidRow">Validate</button>
      <ag-grid-angular
        style="height: 800px; width: 100%;"
        class="ag-theme-quartz"
        [gridOptions]="gridOptions"
        [rowData]="rowData"
        [pagination]="pagination"
        [paginationPageSize]="paginationPageSize"
        [paginationPageSizeSelector]="paginationPageSizeSelector"
        (gridReady)="onGridReady($event)"
      >
      </ag-grid-angular>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
      }
      button {
        margin-bottom: 10px;
      }
    `,
  ],
})
export class OlympicDataComponent {
  gridOptions: any = {
    columnDefs: [
      { field: 'athlete', minWidth: 180 },
      { field: 'age' },
      { field: 'country', minWidth: 150 },
      { field: 'year' },
      { field: 'date', minWidth: 130 },
      { field: 'sport', minWidth: 100 },
      { field: 'gold' },
      { field: 'silver' },
      { field: 'bronze' },
      { field: 'total' },
    ],
    defaultColDef: {
      resizable: true,
      minWidth: 80,
      flex: 1,
      filter: true,
      floatingFilter: true,
      editable: true,
    },
  };

  gridApi!: GridApi;

  rowData: any[] = [];

  pagination: boolean = true;
  paginationPageSize: number = 50;
  paginationPageSizeSelector: number[] = [50, 100, 200, 500];

  constructor(private http: HttpClient) {}

  importExcel(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      console.error('No file selected');
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: 'binary' });
      this.populateGrid(workbook);
    };

    reader.readAsBinaryString(file);

    // this.convertExcelToJson(file);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.gridApi = params.api;
    console.log('Grid API:', this.gridApi);
  }

  convertExcelToJson(file: File) {
    // const input = event.target as HTMLInputElement;
    // if (!input.files || input.files.length === 0) {
    //   console.error('No file selected');
    //   return;
    // }
    // const file = input.files[0];

    let reader = new FileReader();
    let workbookkk: XLSX.WorkBook;
    let XL_row_object;
    let json_object;
    reader.readAsBinaryString(file);
    return new Promise((resolve, reject) => {
      reader.onload = function () {
        let data = reader.result;
        workbookkk = XLSX.read(data, { type: 'binary' });
        workbookkk.SheetNames.forEach(function (sheetName) {
          XL_row_object = XLSX.utils.sheet_to_json(
            workbookkk.Sheets[sheetName]
          );
          json_object = JSON.stringify(XL_row_object);
          //  console.log(json_object);
          //  console.log(XL_row_object);
          resolve(XL_row_object);
        });
      };
    });
  }

  isValidRow = true;

  private populateGrid(workbook: XLSX.WorkBook): void {
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    console.log(worksheet);
    const columns: { [key: string]: string } = {
      A: 'athlete',
      B: 'age',
      C: 'country',
      D: 'year',
      E: 'date',
      F: 'sport',
      G: 'gold',
      H: 'silver',
      I: 'bronze',
      J: 'total',
    };

    const actualColumns: { [key: string]: string } = {};
  Object.keys(columns).forEach((col) => {
    const cell = worksheet[`${col}1`];
    actualColumns[col] = cell ? cell.w : null;
  });

  const missingColumns = Object.keys(columns).filter(
    (key) => actualColumns[key] !== columns[key]
  );

  if (missingColumns.length > 0) {
    alert(
      `Column mismatch. Missing or incorrect columns: ${missingColumns
        .map((key) => `${key} (${columns[key]})`)
        .join(', ')}`
    );
    return;
  }

    const rowData = [];
    let rowIndex = 2;

    while (worksheet[`A${rowIndex}`]) {
      const row: { [key: string]: any } = {};
      // let isValidRow = true;

      Object.keys(columns).forEach((col) => {
        const cell = worksheet[`${col}${rowIndex}`];
        const value = cell ? cell.w : null;
        console.log(columns);
        switch (columns[col]) {
          case 'athlete':
            if (!value || typeof value !== 'string') {
              console.warn(`Invalid athlete data at row ${rowIndex}`);
              this.isValidRow = false;
            }
            break;
          case 'age':
            if (!value || isNaN(Number(value))) {
              console.warn(`Invalid age data at row ${rowIndex}`);
              this.isValidRow = false;
            }
            break;
          case 'country':
            if (!value || typeof value !== 'string') {
              console.warn(`Invalid country data at row ${rowIndex}`);
              this.isValidRow = false;
            }
            break;
          case 'year':
            if (!value || isNaN(Number(value))) {
              console.warn(`Invalid year data at row ${rowIndex}`);
              this.isValidRow = false;
            }
            break;
          case 'date':
            if (!value || isNaN(Date.parse(value))) {
              console.warn(`Invalid date data at row ${rowIndex}`);
              this.isValidRow = false;
            }
            break;
          case 'sport':
            if (!value || typeof value !== 'string') {
              console.warn(`Invalid sport data at row ${rowIndex}`);
              this.isValidRow = false;
            }
            break;
          case 'gold':
          case 'silver':
          case 'bronze':
          case 'total':
            if (!value || isNaN(Number(value))) {
              console.warn(`Invalid medal count data at row ${rowIndex}`);
              this.isValidRow = false;
            }
            break;
          default:
            console.warn(`Unexpected column data at row ${rowIndex}`);
            this.isValidRow = false;
            break;
        }

        row[columns[col]] = value;
      });
      console.log(this.isValidRow);
      rowData.push(row);

      rowIndex++;
    }

    this.rowData = rowData;
  }

  exportToJson() {
    // Get all the rows from the grid
    const allData = this.gridOptions.api.getDataAsJson();

    // Create a Blob from the JSON data
    const blob = new Blob([JSON.stringify(allData)], {
      type: 'application/json',
    });

    // Trigger a download
    saveAs(blob, 'grid-data.json');
  }

  exportSelectedRowsToJson() {
    const selectedRows = this.gridOptions.api.getSelectedRows();
    const blob = new Blob([JSON.stringify(selectedRows)], {
      type: 'application/json',
    });
    saveAs(blob, 'selected-rows.json');
  }
}
