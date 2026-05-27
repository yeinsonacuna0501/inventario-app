import { TestBed } from '@angular/core/testing';

import { ProductoCommandService } from './producto-command.service';

describe('ProductoComandService', () => {
  let service: ProductoCommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoCommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
