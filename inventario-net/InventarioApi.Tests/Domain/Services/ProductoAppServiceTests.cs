using InventarioApi.Application.DTOs;
using InventarioApi.Application.Services;
using InventarioApi.Domain.Entities;
using InventarioApi.Domain.Exceptions;
using InventarioApi.Domain.Repositories;
using InventarioApi.Domain.Services;
using Moq;

namespace InventarioApi.Tests.Domain.Services
{
    public class ProductoAppServiceTests
    {
        private readonly Mock<IProductoRepository> _repositoryMock;
        private readonly Mock<IProductoDomainService> _domainServiceMock;
        private readonly ProductoAppService _sut;

        public ProductoAppServiceTests()
        {
            _repositoryMock = new Mock<IProductoRepository>();
            _domainServiceMock = new Mock<IProductoDomainService>();
            _sut = new ProductoAppService(_repositoryMock.Object, _domainServiceMock.Object);
        }

        [Fact]
        public async Task CrearAsync_ConDatosValidos_RetornaProductoCreado()
        {
            var request = new CrearProductoRequest("Laptop", "Descripcion", 4500000m, 10);
            var productoCreado = Producto.Crear(request.Nombre, request.Descripcion, request.Precio, request.Cantidad);

            _domainServiceMock
                .Setup(s => s.ValidarNombreUnicoAsync(request.Nombre, null, It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            _repositoryMock
                .Setup(r => r.AgregarAsync(It.IsAny<Producto>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            _repositoryMock
                .Setup(r => r.ObtenerPorIdAsync(1, It.IsAny<CancellationToken>()))
                .ReturnsAsync(productoCreado);

            var resultado = await _sut.CrearAsync(request);

            Assert.NotNull(resultado);
            Assert.Equal(request.Nombre, resultado.Nombre);
            Assert.Equal(request.Precio, resultado.Precio);
        }

        [Fact]
        public async Task ActualizarAsync_ConIdInexistente_LanzaProductoNotFoundException()
        {
            var request = new ActualizarProductoRequest("Laptop", "Desc", 1000m, 5);

            _repositoryMock
                .Setup(r => r.ObtenerPorIdAsync(999, It.IsAny<CancellationToken>()))
                .ReturnsAsync((Producto?)null);

            await Assert.ThrowsAsync<ProductoNotFoundException>(() =>
                _sut.ActualizarAsync(999, request));
        }

        [Fact]
        public async Task DescontarStockAsync_ConStockSuficiente_ActualizaCorrectamente()
        {
            var producto = Producto.Crear("Laptop", "Desc", 1000m, 10);
            var request = new DescontarStockRequest(3);

            _repositoryMock
                .Setup(r => r.ObtenerPorIdAsync(1, It.IsAny<CancellationToken>()))
                .ReturnsAsync(producto);

            _domainServiceMock
                .Setup(s => s.ValidarDescuentoDeStock(producto, 3));

            _repositoryMock
                .Setup(r => r.ActualizarAsync(It.IsAny<Producto>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var resultado = await _sut.DescontarStockAsync(1, request);

            Assert.Equal(7, resultado.Cantidad);
            _repositoryMock.Verify(r => r.ActualizarAsync(It.IsAny<Producto>(), It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
