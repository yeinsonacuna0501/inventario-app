from datetime import date
from typing import List, Optional

from src.domain.entities.producto import Producto
from src.domain.repositories.producto_repository import ProductoRepository
from src.domain.services.producto_query_domain_service import ProductoQueryDomainService


class ProductoAppService:

    def __init__(
        self,
        producto_repository: ProductoRepository,
        producto_query_domain_service: ProductoQueryDomainService,
    ) -> None:
        self._producto_repository = producto_repository
        self._producto_query_domain_service = producto_query_domain_service

    def buscar_productos(
        self,
        nombre: Optional[str],
        fecha_inicio: Optional[date],
        fecha_fin: Optional[date],
    ) -> List[Producto]:
        self._producto_query_domain_service.validar_nombre(nombre)
        self._producto_query_domain_service.validar_rango_de_fechas(fecha_inicio, fecha_fin)

        return self._producto_repository.buscar_por_nombre_y_fecha(
            nombre,
            fecha_inicio,
            fecha_fin,
        )