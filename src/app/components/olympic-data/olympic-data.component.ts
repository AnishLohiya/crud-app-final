import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';

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
      <ag-grid-angular
        style="height: 800px; width: 100%;"
        class="ag-theme-quartz"
        [gridOptions]="gridOptions"
        [rowData]="rowData"
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
    },
  };

  rowData: any[] = [];

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

    this.convertExcelToJson(file);
    
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
        console.log(workbookkk);
        workbookkk.SheetNames.forEach(function (sheetName) {
          XL_row_object = XLSX.utils.sheet_to_json(
            workbookkk.Sheets[sheetName]
          );
          json_object = JSON.stringify(XL_row_object);
          //  console.log(json_object);
          //  console.log(XL_row_object);
          resolve(XL_row_object);
          console.log(json_object);

        });
      };
    });
  }

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

    const rowData = [];
    let rowIndex = 2;

    while (worksheet[`A${rowIndex}`]) {
      console.log(worksheet);
      // try to save this data as json
      const row: { [key: string]: any } = {};
      Object.keys(columns).forEach((col) => {
        const cell = worksheet[`${col}${rowIndex}`];
        row[columns[col]] = cell ? cell.w : null;
      });
      rowData.push(row);
      rowIndex++;
    }

    this.rowData = rowData;
  }
}
