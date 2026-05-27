from functools import lru_cache

from src.application.services.producto_app_service import ProductoAppService
from src.domain.services.producto_query_domain_service import ProductoQueryDomainService
from src.infrastructure.repositories.oracle_producto_repository import OracleProductoRepository


@lru_cache
def obtener_producto_app_service() -> ProductoAppService:
    return ProductoAppService(
        producto_repository=OracleProductoRepository(),
        producto_query_domain_service=ProductoQueryDomainService(),
    )