import { Component, OnInit, signal, computed, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductoQueryService } from '../../services/producto-query.service';
import { ProductoCommandService } from '../../services/producto-command.service';
import { Producto, CrearProductoRequest } from '../../models/producto';

import { ProductoFormModalComponent } from '../producto-form-modal/producto-form-modal';
import { ProductoDetalleModalComponent } from '../producto-detalle-modal/producto-detalle-modal';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-producto-tabla-material',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './producto-tabla-material.component.html',
})
export class ProductoTablaMaterialComponent implements OnInit {
  private readonly queryService = inject(ProductoQueryService);
  private readonly commandService = inject(ProductoCommandService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly filtroNombre = signal<string>('');
  readonly filtroFecha = signal<Date | null>(null);

  dataSource = new MatTableDataSource<Producto>([]);
  columnasDefinidas: string[] = ['id', 'nombre', 'descripcion', 'stock', 'precio', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly fechaFiltroIso = computed(() => {
    const fecha = this.filtroFecha();
    return fecha ? new Date(fecha).toISOString().split('T')[0] : '';
  });

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.queryService.consultarInventario(this.filtroNombre(), this.fechaFiltroIso()).subscribe({
      next: (res) => {
        this.dataSource.data = res?.productos ?? [];
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => this.mostrarError('Error al consultar el inventario.'),
    });
  }

  verProducto(producto: Producto): void {
    this.dialog.open(ProductoDetalleModalComponent, {
      data: { producto },
      width: '420px',
    });
  }

  abrirFormularioNuevo(): void {
    const dialogRef = this.dialog.open(ProductoFormModalComponent, {
      data: { producto: null, esModoEdicion: false },
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((resultadoFormulario: Partial<Producto> | undefined) => {
      if (!resultadoFormulario) return;

      const request: CrearProductoRequest = {
        nombre: resultadoFormulario.nombre!,
        descripcion: resultadoFormulario.descripcion ?? '',
        stock: resultadoFormulario.cantidad ?? 0,
        precio: resultadoFormulario.precio ?? 0,
      };

      this.commandService.crear(request).subscribe({
        next: () => this.buscar(),
        error: (err) => this.mostrarError(err?.error?.message || 'Error al crear el producto.'),
      });
    });
  }

  abrirFormularioEditar(producto: Producto): void {
    const dialogRef = this.dialog.open(ProductoFormModalComponent, {
      data: { producto: producto, esModoEdicion: true },
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((resultadoFormulario: Partial<Producto> | undefined) => {
      if (!resultadoFormulario) return;

      const request = {
        nombre: resultadoFormulario.nombre!,
        descripcion: resultadoFormulario.descripcion ?? '',
        precio: resultadoFormulario.precio ?? 0,
        cantidad: resultadoFormulario.cantidad ?? 0,
      };

      this.commandService.actualizar(producto.id, request).subscribe({
        next: () => this.buscar(),
        error: (err) => this.mostrarError(err?.error?.message || 'Error al actualizar el producto.'),
      });
    });
  }

  descontarStock(id: number): void {
    this.commandService.descontarStock(id, { unidades: 1 }).subscribe({
      next: () => this.buscar(),
      error: (err) => this.mostrarError(err?.error?.message || 'Error al descontar stock.'),
    });
  }

  limpiar(): void {
    this.filtroNombre.set('');
    this.filtroFecha.set(null);
    this.buscar();
  }

  private mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}