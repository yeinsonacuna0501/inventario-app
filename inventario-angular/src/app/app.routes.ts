import { Routes } from '@angular/router';
import { ProductoTablaComponent } from './components/producto-tabla.component/producto-tabla.component';
import { ProductoTablaMaterialComponent } from './components/producto-tabla-material.component/producto-tabla-material.component';


export const routes: Routes = [
  { path: 'primeng', component: ProductoTablaComponent },
  { path: 'material', component: ProductoTablaMaterialComponent },
  { path: '', redirectTo: '/material', pathMatch: 'full' } 
];
