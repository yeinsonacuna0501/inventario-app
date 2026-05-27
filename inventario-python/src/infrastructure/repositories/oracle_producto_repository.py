from datetime import date, datetime
from typing import List, Optional

from src.domain.entities.producto import Producto
from src.domain.repositories.producto_repository import ProductoRepository
from src.infrastructure.database.oracle_connection import obtener_conexion


class OracleProductoRepository(ProductoRepository):

    def buscar_por_nombre_y_fecha(
        self,
        nombre: Optional[str],
        fecha_inicio: Optional[date],
        fecha_fin: Optional[date],
    ) -> List[Producto]:
        condiciones = []
        parametros = {}

        if nombre:
            condiciones.append("UPPER(nombre) LIKE UPPER(:nombre)")
            parametros["nombre"] = f"%{nombre}%"

        if fecha_inicio:
            condiciones.append("TRUNC(fecha_registro) >= :fecha_inicio")
            parametros["fecha_inicio"] = fecha_inicio

        if fecha_fin:
            condiciones.append("TRUNC(fecha_registro) <= :fecha_fin")
            parametros["fecha_fin"] = fecha_fin

        clausula_where = f"WHERE {' AND '.join(condiciones)}" if condiciones else ""

        sql = f"""
            SELECT id, nombre, descripcion, precio, cantidad, fecha_registro
              FROM productos
              {clausula_where}
              ORDER BY fecha_registro DESC
        """

        with obtener_conexion() as conexion:
            cursor = conexion.cursor()
            cursor.execute(sql, parametros)
            filas = cursor.fetchall()

        return [self._mapear_a_entidad(fila) for fila in filas]

    def _mapear_a_entidad(self, fila: tuple) -> Producto:
        return Producto(
            id=fila[0],
            nombre=fila[1],
            descripcion=fila[2],
            precio=float(fila[3]),
            cantidad=int(fila[4]),
            fecha_registro=fila[5] if isinstance(fila[5], datetime) else datetime(fila[5].year, fila[5].month, fila[5].day),
        )