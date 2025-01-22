import { NgForOf, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  MatAutocomplete,
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import {
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { FilterNameDialogComponent } from '../preset/filter-name-dialog/filter-name-dialog.component';
import { PresetScreenComponent } from '../preset/preset-screen/preset-screen.component';

@Component({
  selector: 'app-navbar',
  imports: [
    MatAutocompleteModule,
    NgIf,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocomplete,
    MatOptionModule,
    FormsModule,
    NgForOf,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss', '../styles.scss'],
})
export class NavbarComponent {
  @Input() addButtonText?: string;
  @Input() showPresets = true;
  @Input() apiUrl = '';
  @Input() getFilterModel!: () => any;
  @Input() getColumnState!: () => any;
  @Input() setFilterModel!: (model: any) => void;
  @Input() applyColumnState!: (state: any) => void;
  @Input() showExportControls = true;
  @Input() showColumnSearch = true;
  @Input() gridApi!: any;
  @Input() presetList: any[] = [];
  @Input() filteredList: { colId: string }[] = [];

  @Output() clearFilters = new EventEmitter<void>();
  @Output() applyPreset = new EventEmitter<any>();
  @Output() onCsvExport = new EventEmitter<void>();
  @Output() onExcelExport = new EventEmitter<void>();
  @Output() onAddClick = new EventEmitter<void>();

  constructor(private dialog: MatDialog, private http : HttpClient) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadPresets();
  }

  loadPresets() {
    this.http.get(this.apiUrl).subscribe({
      next: (data: any) => {
        console.log('Presets loaded:', this.presetList);
        this.presetList = data;
      },
      error: (err) => {
        console.error('Error loading presets', err);
      },
    });
  }

  onAddClickHandler() {
    this.onAddClick.emit();
  }

  onSearchColumn(event: Event) {
    const searchCol = (event.target as HTMLInputElement).value;

    if (this.gridApi) {
      const cols = this.gridApi.getAllGridColumns();
      this.filteredList = cols.filter((col: any) =>
        col.getColId().toLowerCase().includes(searchCol.toLowerCase())
      );
      console.log('Filtered Columns:', this.filteredList);
    }
  }

  onColumnSelected(event: MatAutocompleteSelectedEvent) {
    const selectedColumn = event.option.value;
    if (!this.gridApi) {
      console.warn('Grid API not initialized.');
      return;
    }

    console.log('Selected Column:', selectedColumn);
    this.gridApi.ensureColumnVisible(selectedColumn, 'start');

    const column = this.gridApi.getColumnDef(selectedColumn);
    if (column) {
      console.log('Column:', column);
      column.cellClass = 'highlight-column';

      setTimeout(() => {
        column.cellClass = '';
        this.gridApi.refreshCells({ force: true });
      }, 1000);
      this.gridApi.refreshCells({ force: true });
    }
  }

  saveFilterModel(): void {
    const filterModel = this.getFilterModel();
    const columnState = this.getColumnState();

    if (Object.keys(filterModel).length > 0 || columnState.length > 0) {
      const dialogRef = this.dialog.open(
        FilterNameDialogComponent,
        {
          width: '400px',
          height: '250px',
        }
      );
  
      dialogRef.afterClosed().subscribe((filterName) => {
        if (filterName) {
          const newPreset = {
            name: filterName,
            state: { filterModel, columnState },
            username: 'admin',
          };
  
          this.http.post(this.apiUrl, newPreset).subscribe({
            next: () => {
              console.log('Preset saved successfully!');
              this.clearFilters.emit();
              this.loadPresets();
            },
            error: (err) => {
              console.error('Error saving filter', err);
            },
          });
        }
      });
    } else {
      alert('No filters to save.');
    }
  }

  openPresetDialog(): void {
    const dialogRef = this.dialog.open(PresetScreenComponent, {
      data: { presets: this.presetList }, 
      width: '1000px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Preset applied:', result);
        this.setFilterModel(result.state.filterModel);
        this.applyColumnState(result.state.columnState);
        this.applyPreset.emit(result.state);
      }
    });
  }

  clearFiltersHandler(): void {
    this.clearFilters.emit();
  }
}
