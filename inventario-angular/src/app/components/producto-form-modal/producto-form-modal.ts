import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule],
  template: `
    <h2 mat-dialog-title style="margin: 0; font-weight: 700; color: #1e293b;">
      {{ data.esModoEdicion ? '📝 Editar Producto' : '🚀 Registrar Nuevo Producto' }}
    </h2>
    <mat-dialog-content style="display: flex; flex-direction: column; gap: 1rem; padding-top: 1rem; min-width: 350px;">
      
      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Nombre del Producto</mat-label>
        <input matInput [(ngModel)]="producto.nombre" placeholder="Ej: Monitor Gamer">
      </mat-form-field>

      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Descripción</mat-label>
        <textarea matInput [(ngModel)]="producto.descripcion" placeholder="Requerido por la API..."></textarea>
      </mat-form-field>

      <div style="display: flex; gap: 1rem;">
        <mat-form-field appearance="outline" style="flex: 1;">
          <mat-label>Precio</mat-label>
          <input matInput type="number" [(ngModel)]="producto.precio" placeholder="0">
        </mat-form-field>

        <mat-form-field appearance="outline" style="flex: 1;">
          <mat-label>Stock / Cantidad</mat-label>
          <input matInput type="number" [(ngModel)]="producto.cantidad" placeholder="0">
        </mat-form-field>
      </div>

    </mat-dialog-content>
    <mat-dialog-actions align="end" style="padding-bottom: 1rem;">
      <button mat-button (click)="cancelar()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="guardar()">Guardar</button>
    </mat-dialog-actions>
  `
})
export class ProductoFormModalComponent {
  producto: Partial<Producto>;

  constructor(
    public dialogRef: MatDialogRef<ProductoFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { producto?: Producto; esModoEdicion: boolean }
  ) {
    this.producto = data.producto ? { ...data.producto } : { nombre: '', descripcion: '', precio: 0, cantidad: 0 };
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    this.dialogRef.close(this.producto);
  }
}