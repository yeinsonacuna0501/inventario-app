from abc import ABC, abstractmethod
from datetime import date
from typing import List, Optional

from src.domain.entities.producto import Producto


class ProductoRepository(ABC):

    @abstractmethod
    def buscar_por_nombre_y_fecha(
        self,
        nombre: Optional[str],
        fecha_inicio: Optional[date],
        fecha_fin: Optional[date],
    ) -> List[Producto]:
        raise NotImplementedError