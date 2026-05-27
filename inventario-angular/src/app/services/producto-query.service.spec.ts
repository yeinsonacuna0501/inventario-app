import { TestBed } from '@angular/core/testing';

import { ProductoQueryService } from './producto-query.service';

describe('ProductoQuery', () => {
  let service: ProductoQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
