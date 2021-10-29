import { TestBed } from '@angular/core/testing';

import { AadhaarService } from './aadhaar.service';

describe('AadhaarService', () => {
  let service: AadhaarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AadhaarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
