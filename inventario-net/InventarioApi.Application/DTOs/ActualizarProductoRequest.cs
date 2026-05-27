namespace InventarioApi.Application.DTOs
{
    public record ActualizarProductoRequest(string Nombre, string Descripcion, decimal Precio, int Cantidad
    );
}
