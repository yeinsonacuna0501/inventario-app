import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ApiResponsePython } from '../models/producto'; 

@Injectable({
  providedIn: 'root'
})
export class ProductoQueryService {
  private apiUrl = environment.pythonApiUrl;

  constructor(private http: HttpClient) {}

  consultarInventario(nombre?: string, fecha?: string): Observable<ApiResponsePython> {
    let params = new HttpParams();
    if (nombre) params = params.set('nombre', nombre);
    if (fecha) params = params.set('fecha_inicio', fecha);

    return this.http.get<ApiResponsePython>(this.apiUrl, { params });
  }
}