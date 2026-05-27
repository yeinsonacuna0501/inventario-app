using InventarioApi.Application.DTOs;

namespace InventarioApi.Application.Ports
{
    public interface IProductoAppService
    {
        Task<ProductoResponse> CrearAsync(CrearProductoRequest request, CancellationToken cancellationToken = default);
        Task<ProductoResponse> ActualizarAsync(int id, ActualizarProductoRequest request, CancellationToken cancellationToken = default);
        Task<ProductoResponse> DescontarStockAsync(int id, DescontarStockRequest request, CancellationToken cancellationToken = default);
    }
}
