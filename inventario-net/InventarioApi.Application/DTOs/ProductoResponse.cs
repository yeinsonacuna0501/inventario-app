namespace InventarioApi.Application.DTOs
{
    public record ProductoResponse(int Id, string Nombre, string Descripcion, decimal Precio, int Cantidad, DateTime FechaRegistro);
}
