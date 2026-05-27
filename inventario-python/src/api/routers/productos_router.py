from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from src.api.dependencies import obtener_producto_app_service
from src.api.schemas.producto_schema import ProductosResponse, ProductoResponse
from src.application.services.producto_app_service import ProductoAppService

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get(
    "",
    response_model=ProductosResponse,
    status_code=status.HTTP_200_OK,
    summary="Consultar productos por nombre y fecha",
)
def buscar_productos(
    nombre: Optional[str] = Query(default=None, description="Nombre o parte del nombre del producto"),
    fecha_inicio: Optional[date] = Query(default=None, description="Fecha de inicio del rango (YYYY-MM-DD)"),
    fecha_fin: Optional[date] = Query(default=None, description="Fecha de fin del rango (YYYY-MM-DD)"),
    app_service: ProductoAppService = Depends(obtener_producto_app_service),
) -> ProductosResponse:
    try:
        productos = app_service.buscar_productos(nombre, fecha_inicio, fecha_fin)
        return ProductosResponse(
            total=len(productos),
            productos=[
                ProductoResponse(
                    id=p.id,
                    nombre=p.nombre,
                    descripcion=p.descripcion,
                    precio=p.precio,
                    cantidad=p.cantidad,
                    fecha_registro=p.fecha_registro,
                )
                for p in productos
            ],
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(error),
        )