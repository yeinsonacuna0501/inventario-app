import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-producto-detalle-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title style="margin: 0; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 0.5rem;">
      <mat-icon color="primary">search</mat-icon> Vista Detallada del Artículo
    </h2>
    
    <mat-dialog-content style="min-width: 380px; padding-top: 1.5rem; color: #334155; line-height: 1.8;">
      <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 0.8rem;">
        <p style="margin: 0;"><strong>ID Interno:</strong> <span style="color: #64748b;">{{ data.producto.id }}</span></p>
        <p style="margin: 0;"><strong>Nombre Técnico:</strong> <span style="color: #0f172a; font-weight: 600;">{{ data.producto.nombre }}</span></p>
        <p style="margin: 0;"><strong>Descripción:</strong> <span style="color: #475569;">{{ data.producto.descripcion }}</span></p>
        <p style="margin: 0;"><strong>Existencias actuales:</strong> 
          <span [style.color]="data.producto.cantidad < 5 ? '#ef4444' : '#10b981'" style="font-weight: 700;">
            {{ data.producto.cantidad }} unidades
          </span>
        </p>
        <p style="margin: 0;"><strong>Precio Unitario:</strong> <span style="font-weight: 600; color: #0f172a;">{{ data.producto.precio | currency:'USD' }}</span></p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" style="padding-bottom: 1rem; padding-right: 1.5rem;">
      <button mat-flat-button color="primary" style="border-radius: 20px;" (click)="cerrar()">Cerrar Vista</button>
    </mat-dialog-actions>
  `
})
export class ProductoDetalleModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductoDetalleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { producto: Producto }
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}