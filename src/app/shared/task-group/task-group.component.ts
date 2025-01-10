import { NgComponentOutlet, NgFor } from '@angular/common';
import { Component, Type } from '@angular/core';
import { MatTabGroup, MatTabLink, MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { ProductComponent } from '../../components/product/product.component';
import { OlympicDataComponent } from '../../components/olympic-data/olympic-data.component';
import { EquityComponent } from '../../components/equity/equity.component';
import { CustomComponent } from '../../components/custom/custom.component';


@Component({
  selector: 'app-task-group',
  imports: [MatTabsModule, MatTabGroup, NgComponentOutlet],
  templateUrl: './task-group.component.html',
  styleUrl: './task-group.component.scss'
})
export class TaskGroupComponent {
  tabs = [
    { label: 'Custom', component: CustomComponent },
    { label: 'Products', component: ProductComponent },
    { label: 'Olympic Data', component: OlympicDataComponent },
    { label: 'Equity', component: EquityComponent },
  ];

  shuffleTabs = [
    { label: 'Equity', component: EquityComponent },
    { label: 'Products', component: ProductComponent },
    { label: 'Olympic Data', component: OlympicDataComponent },
  ];

  selectedTab = this.tabs[0];
  selectedTabIndex = 0;

  constructor() {
  }

  selectTab(tab: any, index: number) {
    this.selectedTab = tab;
    this.selectedTabIndex = index;
  }

  getComponentType(component: any) {
    return component;
  }
}
