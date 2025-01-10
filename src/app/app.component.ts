import { Component } from '@angular/core';
import { MatTabNavPanel, MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import { OlympicDataComponent } from './components/olympic-data/olympic-data.component';
import { EquityComponent } from './components/equity/equity.component';
import { NgForOf } from '@angular/common';
import { TaskGroupComponent } from './shared/task-group/task-group.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatTabsModule, ProductComponent, OlympicDataComponent, EquityComponent, NgForOf, MatTabsModule, MatTabNavPanel, TaskGroupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  links!: string[];
  activeLink: any;

  ngOnInit() {
   window.setTimeout(() => this.links = ['Products', 'Olympic Data', 'Equities'], 0);
  }
}
