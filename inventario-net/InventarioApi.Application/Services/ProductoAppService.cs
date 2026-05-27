using InventarioApi.Application.DTOs;
using InventarioApi.Application.Mappers;
using InventarioApi.Application.Ports;
using InventarioApi.Domain.Entities;
using InventarioApi.Domain.Exceptions;
using InventarioApi.Domain.Repositories;
using InventarioApi.Domain.Services;

namespace InventarioApi.Application.Services
{
    public class ProductoAppService(IProductoRepository productoRepository, IProductoDomainService productoDomainService) : IProductoAppService
    {
        private readonly IProductoRepository _productoRepository = productoRepository;
        private readonly IProductoDomainService _productoDomainService = productoDomainService;

        public async Task<ProductoResponse> CrearAsync(CrearProductoRequest request, CancellationToken cancellationToken = default)
        {
            await _productoDomainService.ValidarNombreUnicoAsync(request.Nombre, cancellationToken: cancellationToken);

            var producto = Producto.Crear(request.Nombre, request.Descripcion, request.Precio, request.Cantidad);

            var id = await _productoRepository.AgregarAsync(producto, cancellationToken);

            var productoCreado = await _productoRepository.ObtenerPorIdAsync(id, cancellationToken)
                ?? throw new DomainException("Error al recuperar el producto recién creado.");

            return ProductoMapper.ToResponse(productoCreado);
        }

        public async Task<ProductoResponse> ActualizarAsync(int id, ActualizarProductoRequest request, CancellationToken cancellationToken = default)
        {
            var producto = await _productoRepository.ObtenerPorIdAsync(id, cancellationToken)
                ?? throw new ProductoNotFoundException(id);

            await _productoDomainService.ValidarNombreUnicoAsync(request.Nombre, id, cancellationToken);

            producto.Actualizar(request.Nombre, request.Descripcion, request.Precio, request.Cantidad);

            await _productoRepository.ActualizarAsync(producto, cancellationToken);

            return ProductoMapper.ToResponse(producto);
        }

        public async Task<ProductoResponse> DescontarStockAsync(int id, DescontarStockRequest request, CancellationToken cancellationToken = default)
        {
            var producto = await _productoRepository.ObtenerPorIdAsync(id, cancellationToken)
                ?? throw new ProductoNotFoundException(id);

            _productoDomainService.ValidarDescuentoDeStock(producto, request.Unidades);

            producto.DescontarStock(request.Unidades);

            await _productoRepository.ActualizarAsync(producto, cancellationToken);

            return ProductoMapper.ToResponse(producto);
        }
    }
}
