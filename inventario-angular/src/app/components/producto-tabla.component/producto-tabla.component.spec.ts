import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoTablaComponent } from './producto-tabla.component';

describe('ProductoTablaComponent', () => {
  let component: ProductoTablaComponent;
  let fixture: ComponentFixture<ProductoTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoTablaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoTablaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
