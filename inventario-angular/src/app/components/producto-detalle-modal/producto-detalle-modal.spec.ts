import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoDetalleModal } from './producto-detalle-modal';

describe('ProductoDetalleModal', () => {
  let component: ProductoDetalleModal;
  let fixture: ComponentFixture<ProductoDetalleModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoDetalleModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoDetalleModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
