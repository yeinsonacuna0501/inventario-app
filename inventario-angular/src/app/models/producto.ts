export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;        
  fecha_registro: string;  
  codigo?: string;       
}

export interface ApiResponsePython {
  total: number;
  productos: Producto[];
}

export interface CrearProductoRequest {
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
}

export interface ActualizarProductoRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad: number;
}

export interface DescontarStockRequest {
  unidades: number;
}