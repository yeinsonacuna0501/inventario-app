import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-form-modal',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule
  ],
  template: `
    <h2 mat-dialog-title style="margin: 0; font-weight: 700; color: #1e293b;">
      {{ data.esModoEdicion ? '📝 Editar Producto' : '🚀 Registrar Nuevo Producto' }}
    </h2>
    
    <form [formGroup]="productoForm" (ngSubmit)="guardar()">
      <mat-dialog-content style="display: flex; flex-direction: column; gap: 1rem; padding-top: 1rem; min-width: 350px;">
        
        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Nombre del Producto</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej: Monitor Gamer">
          
          @if (productoForm.get('nombre')?.hasError('required')) {
            <mat-error>
              El nombre es <strong>obligatorio</strong>.
            </mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" style="width: 100%;">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="descripcion" placeholder="Ej: Dispositivo de alta resolución..."></textarea>
        </mat-form-field>

        <div style="display: flex; gap: 1rem;">
          <mat-form-field appearance="outline" style="flex: 1;">
            <mat-label>Precio</mat-label>
            <input matInput type="number" formControlName="precio" placeholder="0">
            
            @if (productoForm.get('precio')?.hasError('min')) {
              <mat-error>
                Debe ser mayor a 0.
              </mat-error>
            }
            @if (productoForm.get('precio')?.hasError('required')) {
              <mat-error>
                El precio es requerido.
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" style="flex: 1;">
            <mat-label>Stock / Cantidad</mat-label>
            <input matInput type="number" formControlName="cantidad" placeholder="0">
            
            @if (productoForm.get('cantidad')?.hasError('min')) {
              <mat-error>
                No puede ser negativo.
              </mat-error>
            }
            @if (productoForm.get('cantidad')?.hasError('required')) {
              <mat-error>
                El stock es requerido.
              </mat-error>
            }
          </mat-form-field>
        </div>

      </mat-dialog-content>
      
      <mat-dialog-actions align="end" style="padding-bottom: 1rem; padding-right: 1.5rem;">
        <button mat-button type="button" (click)="cancelar()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="productoForm.invalid">Guardar</button>
      </mat-dialog-actions>
    </form>
  `
})
export class ProductoFormModalComponent {
  private readonly fb = inject(FormBuilder);
  
  productoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ProductoFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { producto?: Producto; esModoEdicion: boolean }
  ) {
    this.productoForm = this.fb.group({
      nombre: [
        data.producto ? data.producto.nombre : '', 
        [Validators.required, Validators.maxLength(150)]
      ],
      descripcion: [
        data.producto ? data.producto.descripcion ?? '' : ''
      ],
      precio: [
        data.producto ? data.producto.precio : 0, 
        [Validators.required, Validators.min(0.01)]
      ],
      cantidad: [
        data.producto ? data.producto.cantidad : 0, 
        [Validators.required, Validators.min(0)]
      ]
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }
    
    this.dialogRef.close(this.productoForm.value);
  }
}