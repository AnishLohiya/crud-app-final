import { TestBed } from '@angular/core/testing';

import { EquityService } from './equity.service';

describe('EquityService', () => {
  let service: EquityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
