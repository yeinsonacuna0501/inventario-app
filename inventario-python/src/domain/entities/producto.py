from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class Producto:
    id: int
    nombre: str
    descripcion: Optional[str]
    precio: float
    cantidad: int
    fecha_registro: datetime