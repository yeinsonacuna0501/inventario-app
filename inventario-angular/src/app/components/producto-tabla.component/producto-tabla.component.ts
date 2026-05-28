import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';

import { ProductoQueryService } from '../../services/producto-query.service';
import { ProductoCommandService } from '../../services/producto-command.service';
import { Producto, CrearProductoRequest } from '../../models/producto';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';      
import { InputNumberModule } from 'primeng/inputnumber'; 
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-producto-tabla',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    TableModule, 
    ButtonModule, 
    InputTextModule, 
    DatePickerModule, 
    DialogModule, 
    InputNumberModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './producto-tabla.component.html'
})
export class ProductoTablaComponent implements OnInit {
  private readonly queryService = inject(ProductoQueryService);
  private readonly commandService = inject(ProductoCommandService);
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  readonly productos = signal<Producto[]>([]);
  readonly filtroNombre = signal<string>('');
  readonly filtroFecha = signal<Date | null>(null);

  readonly mostrarFormularioModal = signal<boolean>(false);
  readonly mostrarLupaModal = signal<boolean>(false);
  readonly esModoEdicion = signal<boolean>(false);
  
  readonly productoSeleccionado = signal<Producto | null>(null);

  productoForm: FormGroup;

  readonly fechaFiltroIso = computed(() => {
    const fecha = this.filtroFecha();
    return fecha ? new Date(fecha).toISOString().split('T')[0] : '';
  });

  constructor() {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      descripcion: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      precio: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.queryService
      .consultarInventario(this.filtroNombre(), this.fechaFiltroIso())
      .subscribe({
        next: (res) => {
          this.productos.set(res?.productos ?? []);
        },
        error: (err) => this.mostrarError('Error al consultar el inventario.')
      });
  }

  abrirFormularioNuevo(): void {
    this.esModoEdicion.set(false);
    this.productoSeleccionado.set(null);
    this.productoForm.reset({ nombre: '', descripcion: '', stock: 0, precio: 0 });
    this.mostrarFormularioModal.set(true);
  }

  abrirFormularioEditar(producto: Producto): void {
    this.esModoEdicion.set(true);
    this.productoSeleccionado.set(producto);
    this.productoForm.setValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion ?? '',
      stock: producto.cantidad,
      precio: producto.precio
    });
    this.mostrarFormularioModal.set(true);
  }

  verProducto(producto: Producto): void {
    this.productoSeleccionado.set(producto);
    this.mostrarLupaModal.set(true);
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const formularioActual = this.productoForm.value;
    
    if (this.esModoEdicion() && this.productoSeleccionado()) {
      const id = this.productoSeleccionado()!.id;
      const request = {
        nombre: formularioActual.nombre,
        descripcion: formularioActual.descripcion,
        precio: formularioActual.precio,
        cantidad: formularioActual.stock 
      };
      
      this.commandService.actualizar(id, request).subscribe({
        next: () => this.finalizarTransaccion(),
        error: (err) => this.mostrarError(err?.error?.message || 'Error al actualizar el producto.')
      });
    } else {
      const request: CrearProductoRequest = {
        nombre: formularioActual.nombre,
        descripcion: formularioActual.descripcion,
        stock: formularioActual.stock,
        precio: formularioActual.precio,
        cantidad: formularioActual.stock 
      };
      
      this.commandService.crear(request).subscribe({
        next: () => this.finalizarTransaccion(),
        error: (err) => this.mostrarError(err?.error?.message || 'Error al crear el producto.')
      });
    }
  }

  descontarStock(id: number): void {
    this.commandService.descontarStock(id, { unidades: 1 }).subscribe({
      next: () => this.buscar(),
      error: (err) => this.mostrarError(err?.error?.message || 'Error al descontar stock.')
    });
  }

  private finalizarTransaccion(): void {
    this.mostrarFormularioModal.set(false);
    this.buscar();
  }

  limpiar(): void {
    this.filtroNombre.set('');
    this.filtroFecha.set(null);
    this.buscar();
  }

  private mostrarError(mensaje: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Operación Fallida',
      detail: mensaje,
      life: 5000
    });
  }
}