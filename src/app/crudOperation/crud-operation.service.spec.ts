import { TestBed } from '@angular/core/testing';

import { CrudOperationService } from './crud-operation.service';

describe('CrudOperationService', () => {
  let service: CrudOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
