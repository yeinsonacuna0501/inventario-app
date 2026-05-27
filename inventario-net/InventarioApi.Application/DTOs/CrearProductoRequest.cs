namespace InventarioApi.Application.DTOs
{
    public record CrearProductoRequest(string Nombre, string Descripcion, decimal Precio, int Cantidad);
}
