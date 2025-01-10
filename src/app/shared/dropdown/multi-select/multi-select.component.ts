import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ODataDataSource } from 'odata-data-source';
import { TextFilter } from './text-filter';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-multi-select',
  imports: [NgFor, NgIf],
  template: `
   <div class="dropdown">
  <input 
    type="text" 
    id="search-input"
    (input)="onSearchChange($event)" 
    placeholder="Search" 
    class="dropdown-input" 
    aria-label="Search options"
  />
  <div *ngIf="filteredValues.length > 0; else noResults">
    <div *ngFor="let value of filteredValues; let i = index">
      <div class="item">
        <input
          type="checkbox"
          [id]="'checkbox-' + i"
          [checked]="selectedValues.includes(value)"
          (change)="onCheckboxChange(value)"
          aria-labelledby="'label-' + i"
        />
        <label [id]="'label-' + i" [for]="'checkbox-' + i">{{ value }}</label>
      </div>
    </div>
  </div>
  <ng-template #noResults>
    <p class="no-results">No results found</p>
  </ng-template>
</div>

  `,
  styles: [
    `
      .dropdown {
        margin-top: 45px;
        max-height: 220px;
        overflow-y: auto;
        padding: 10px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
      .item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      .dropdown-input {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    `,
  ],
})
export class MultiSelectComponent implements ICellEditorAngularComp, OnInit {
  params: any;
  selectedValues: any[] = [];
  filteredValues: any[] = [];
  allValues: any[] = [];
  dataSource!: ODataDataSource;

  model!: TextFilter;

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {}

  agInit(params: any): void {
    this.params = params;
    this.selectedValues = [...(params.value || [])];
    const resourcePath = 'https://services.odata.org/V4/OData/OData.svc/Products';
    this.dataSource = new ODataDataSource(this.httpClient, resourcePath);
    this.dataSource.connect().subscribe((data) => {
      this.allValues = data.map((item: any) => item.Name);
      this.filteredValues = [...this.allValues];
    });
  }

  getValue(): any {
    return this.selectedValues;
  }

  isPopup(): boolean {
    return true;
  }

  onCheckboxChange(value: any): void {
    if (this.selectedValues.includes(value)) {
      this.selectedValues = this.selectedValues.filter((v) => v !== value);
    } else {
      this.selectedValues.push(value);
    }
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value;
  
    const textFilter = new TextFilter('Name'); 
    textFilter.value = filterValue;
  
    this.dataSource.filters = [textFilter];
    
    this.dataSource.connect().subscribe((data) => {
      this.filteredValues = data.map((item: any) => item.Name);
    });
  }
  
  
}