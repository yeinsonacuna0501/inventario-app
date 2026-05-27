import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoTablaMaterialComponent } from './producto-tabla-material.component';

describe('ProductoTablaMaterialComponent', () => {
  let component: ProductoTablaMaterialComponent;
  let fixture: ComponentFixture<ProductoTablaMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoTablaMaterialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoTablaMaterialComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
