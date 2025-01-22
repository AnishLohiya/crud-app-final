import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { MatChip, MatChipSet, MatChipsModule } from '@angular/material/chips';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

@Component({
    standalone: true,
    imports: [NgFor, NgClass, MatChipSet, MatChip, MatChipsModule],
    template: `
        <div [ngClass]="{ 'custom-color-cell-renderer': true, 'color-pill': isChip, 'color-tag': !isChip }">
            <mat-chip-set>
                <mat-chip *ngFor="let value of values">
                    <span>{{ value }}</span>
                </mat-chip>
            </mat-chip-set>
        </div>
    `,
    styles: [],
})
export class MultiCellRenderer implements ICellRendererAngularComp {
    public params!: ICellRendererParams;
    public isChip!: boolean;
    public values!: string[];

    agInit(params: ICellRendererParams): void {
        const { value } = params;

        this.params = params;
        const isChip = (this.isChip = Array.isArray(value));
        this.values = (this.isChip ? value : [value]).filter((value: string | null) => value != null && value !== '');
    }

    refresh() {
        return false;
    }
}