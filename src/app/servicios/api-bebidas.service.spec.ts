import { TestBed } from '@angular/core/testing';

import { ApiBebidasService } from './api-bebidas.service';

describe('ApiBebidasService', () => {
  let service: ApiBebidasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiBebidasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
