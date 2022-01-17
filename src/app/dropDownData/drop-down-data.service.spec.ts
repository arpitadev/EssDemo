import { TestBed } from '@angular/core/testing';

import { DropDownDataService } from './drop-down-data.service';

describe('DropDownDataService', () => {
  let service: DropDownDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropDownDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
