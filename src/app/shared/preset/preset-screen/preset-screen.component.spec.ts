import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetScreenComponent } from './preset-screen.component';

describe('PresetScreenComponent', () => {
  let component: PresetScreenComponent;
  let fixture: ComponentFixture<PresetScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresetScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresetScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
