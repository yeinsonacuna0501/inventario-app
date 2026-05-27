import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoFormModal } from './producto-form-modal';

describe('ProductoFormModal', () => {
  let component: ProductoFormModal;
  let fixture: ComponentFixture<ProductoFormModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoFormModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoFormModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
