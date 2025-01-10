import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridOptions, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';
import OdataProvider from 'ag-grid-odata';
import { AgGridAngular } from 'ag-grid-angular';
import { NgFor } from '@angular/common';

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}


@Component({
  selector: 'app-product',
  imports: [AgGridAngular, NgFor],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  private gridApi!: GridApi;

  gridOptions: GridOptions = {
    columnDefs: [
      { field: 'id' },
      { field: 'title', filter: 'agSetColumnFilter' },
      { field: 'completed' },
    ],
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: true,
      flex: 1,
    },
    rowSelection: 'multiple',
    pagination: true,
    paginationPageSize: 50,
    onGridReady: (params: GridReadyEvent) => this.onGridReady(params),
  };

  rowData: TodoItem[] = [];
  titles: string[] = [];
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.setDatasource();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.setDatasource();
  }

  setDatasource(): void {
    const odataProvider = new OdataProvider({
      callApi: (options) =>
        fetch(`https://jsonplaceholder.typicode.com/todos`)
          .then((resp) => resp.json())
          .then((data: TodoItem[]) => data),
        
      beforeRequest: (query, provider) => {
        query.expand = ['title'];
      },
      afterLoadData: (options, rowData, totalCount) => {
        console.log('After Load Data:', rowData);
        if (options.skip === 0 && rowData.length > 0) {
          this.gridApi.autoSizeAllColumns();
          console.log(rowData);
        }
      }
    });

    odataProvider.callApi('').then((data: TodoItem[]) => {
      console.log('Fetched Data:', data);
      this.rowData = data;
      this.titles = data.map((item: TodoItem) => item.title);
      if (this.gridApi) {
        this.gridApi.refreshCells({ force: true });
      }
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  }

  onTitleFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedTitle = selectElement.value;

    const odataProvider = new OdataProvider({
      callApi: (options) =>
        fetch(`https://jsonplaceholder.typicode.com/todos?$filter=title eq '${selectedTitle}'`)
          .then(resp => resp.json())
          .then((data: TodoItem[]) => data),
      beforeRequest: (query, provider) => {
        query.expand = ["title"];
      },
      afterLoadData: (options, rowData, totalCount) => {
        if (options.skip === 0 && rowData.length > 0) {
          this.gridApi.autoSizeAllColumns();
          console.log(rowData);
        }
      }
    });

    // Fetch filtered data using OdataProvider and set it to the grid
    odataProvider.callApi(`https://jsonplaceholder.typicode.com/todos?$filter=title eq '${selectedTitle}'`).then((data: TodoItem[]) => {
      this.rowData = data;
      console.log('Filtered Data:', data);
      if (this.gridApi) {
        this.gridApi.refreshCells({ force: true });
      }
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  }
}
