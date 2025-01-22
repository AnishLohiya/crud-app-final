import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopulateDataGridComponent } from './populate-data-grid.component';

describe('PopulateDataGridComponent', () => {
  let component: PopulateDataGridComponent;
  let fixture: ComponentFixture<PopulateDataGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopulateDataGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopulateDataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
