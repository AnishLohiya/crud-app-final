import { TestBed } from '@angular/core/testing';

import { OlympicsDataService } from './olympics-data.service';

describe('OlympicsDataService', () => {
  let service: OlympicsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OlympicsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
