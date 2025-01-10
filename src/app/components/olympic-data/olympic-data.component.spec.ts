import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OlympicDataComponent } from './olympic-data.component';

describe('OlympicDataComponent', () => {
  let component: OlympicDataComponent;
  let fixture: ComponentFixture<OlympicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlympicDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OlympicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
