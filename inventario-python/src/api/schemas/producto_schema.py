from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel


class ProductoResponse(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str]
    precio: float
    cantidad: int
    fecha_registro: datetime

    class Config:
        from_attributes = True


class ProductosResponse(BaseModel):
    total: int
    productos: List[ProductoResponse]