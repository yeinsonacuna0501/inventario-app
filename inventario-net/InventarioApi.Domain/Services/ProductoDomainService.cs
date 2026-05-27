using InventarioApi.Domain.Entities;
using InventarioApi.Domain.Exceptions;
using InventarioApi.Domain.Repositories;

namespace InventarioApi.Domain.Services
{
    public class ProductoDomainService(IProductoRepository productoRepository) : IProductoDomainService
    {
        private readonly IProductoRepository _productoRepository = productoRepository;

        public async Task ValidarNombreUnicoAsync(string nombre, int? excluirId = null, CancellationToken cancellationToken = default)
        {
            var nombreExiste = await _productoRepository.ExisteConNombreAsync(nombre, excluirId, cancellationToken);

            if (nombreExiste)
                throw new DomainException($"Ya existe un producto registrado con el nombre '{nombre}'.");
        }

        public void ValidarDescuentoDeStock(Producto producto, int unidades)
        {
            if (unidades <= 0)
                throw new DomainException("Las unidades a descontar deben ser mayores a cero.");

            if (producto.Cantidad.Valor < unidades)
                throw new DomainException(
                    $"Stock insuficiente para '{producto.Nombre}'. " +
                    $"Disponible: {producto.Cantidad.Valor}, solicitado: {unidades}.");
        }
    }
}
