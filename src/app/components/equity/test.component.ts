import { Component } from '@angular/core';
import type { IToolPanelAngularComp } from 'ag-grid-angular';
import type { IToolPanelParams } from 'ag-grid-community';
import { equityFormFields } from '../../utils/form-fields/equityFormFields';
import { MatDialog } from '@angular/material/dialog';
import { EquityComponent } from './equity.component';

export interface CustomStatsToolPanelParams extends IToolPanelParams {
    title: string;
}

@Component({
    standalone: true,
    template: ` <div style="text-align: center">
        <span>
            <h2><i class="fa fa-calculator"></i> {{ title }}</h2>
        </span>
        <button (click)="openGrid()">Preset Panel</button>
    </div>`,
    styles: [
        `
            .totalStyle {
                padding-bottom: 15px;
            }
        `,
    ],
})
export class TestComponent implements IToolPanelAngularComp {
    private params!: CustomStatsToolPanelParams;

    public title!: string;
    
    constructor(private dialog: MatDialog) {}
    agInit(params: CustomStatsToolPanelParams): void {
        this.params = params;
        this.title = params.title;
        
        this.params.api.addEventListener('modelUpdated', this.updateBeta.bind(this));
    }

    updateBeta(): void {
        this.params.api.forEachNode((node) => {
            // console.log(node.data[0]);
        });
    }

    openGrid() {
        this.dialog.open(EquityComponent, {
          data: {
            formFields: equityFormFields,
            initialValues: {},
          },
        });
    }
    refresh(): void {}
}