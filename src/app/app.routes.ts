import { Routes } from '@angular/router';
import { OlympicDataComponent } from './components/olympic-data/olympic-data.component';
import { ProductComponent } from './components/product/product.component';
import { EquityComponent } from './components/equity/equity.component';
import { CustomComponent } from './components/custom/custom.component';

export const routes: Routes = [
    {
      path: 'data-tabs',
      children: [
        { path: 'products', component: ProductComponent },
        { path: 'data', component: OlympicDataComponent },
        { path: 'equities', component: EquityComponent },
        { path: 'custom', component: CustomComponent },
        { path: '', redirectTo: 'products', pathMatch: 'full' },
      ],
    },
    {
      path: 'custom-tabs',
      children: [
        { path: 'products', component: ProductComponent },
        { path: 'data', component: OlympicDataComponent },
        { path: 'equities', component: EquityComponent },
        { path: '', redirectTo: 'products', pathMatch: 'full' },
      ],
    },
    { path: '', redirectTo: '/data-tabs/products', pathMatch: 'full' },
  ];