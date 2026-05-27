using InventarioApi.Application.DTOs;
using InventarioApi.Domain.Entities;

namespace InventarioApi.Application.Mappers
{
    public static class ProductoMapper
    {
        public static ProductoResponse ToResponse(Producto producto) =>
            new(
                producto.Id,
                producto.Nombre,
                producto.Descripcion,
                producto.Precio,
                producto.Cantidad.Valor,
                producto.FechaRegistro
            );
    }
}
