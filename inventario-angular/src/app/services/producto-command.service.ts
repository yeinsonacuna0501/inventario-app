import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Producto, CrearProductoRequest, ActualizarProductoRequest, DescontarStockRequest } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoCommandService {
  private apiUrl = environment.netApiUrl;

  constructor(private http: HttpClient) {}

  crear(request: CrearProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, request);
  }

  actualizar(id: number, request: ActualizarProductoRequest): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, request);
  }

  descontarStock(id: number, request: DescontarStockRequest): Observable<Producto> {
    return this.http.patch<Producto>(`${this.apiUrl}/${id}/stock/descontar`, request);
  }
}