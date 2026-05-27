using InventarioApi.Domain.Entities;

namespace InventarioApi.Domain.Repositories
{
    public interface IProductoRepository
    {
        Task<Producto?> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default);
        Task<bool> ExisteConNombreAsync(string nombre, int? excluirId = null, CancellationToken cancellationToken = default);
        Task<int> AgregarAsync(Producto producto, CancellationToken cancellationToken = default);
        Task ActualizarAsync(Producto producto, CancellationToken cancellationToken = default);
    }
}
