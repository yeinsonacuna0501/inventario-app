from datetime import date
from typing import Optional


class ProductoQueryDomainService:

    def validar_rango_de_fechas(
        self,
        fecha_inicio: Optional[date],
        fecha_fin: Optional[date],
    ) -> None:
        if fecha_inicio and fecha_fin and fecha_inicio > fecha_fin:
            raise ValueError(
                "La fecha de inicio no puede ser posterior a la fecha de fin."
            )

    def validar_nombre(self, nombre: Optional[str]) -> None:
        if nombre is not None and len(nombre.strip()) == 0:
            raise ValueError("El nombre de búsqueda no puede estar vacío.")