import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatTabsModule,  MatTabsModule, NavbarComponent],
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
