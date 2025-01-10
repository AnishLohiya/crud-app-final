import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGenericGridComponent } from './ag-generic-grid.component';

describe('AgGenericGridComponent', () => {
  let component: AgGenericGridComponent;
  let fixture: ComponentFixture<AgGenericGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgGenericGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgGenericGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
