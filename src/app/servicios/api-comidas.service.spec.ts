import { TestBed } from '@angular/core/testing';

import { ApiComidasService } from './api-comidas.service';

describe('ApiComidasService', () => {
  let service: ApiComidasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiComidasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
