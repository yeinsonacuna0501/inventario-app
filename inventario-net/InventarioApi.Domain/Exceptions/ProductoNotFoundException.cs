namespace InventarioApi.Domain.Exceptions
{
    public class ProductoNotFoundException(int id) : DomainException($"No existe un producto con el identificador {id}.")
    {
    }
}
