using InventarioApi.Domain.Entities;

namespace InventarioApi.Domain.Services
{
    public interface IProductoDomainService
    {
        Task ValidarNombreUnicoAsync(string nombre, int? excluirId = null, CancellationToken cancellationToken = default);
        void ValidarDescuentoDeStock(Producto producto, int unidades);
    }
}
