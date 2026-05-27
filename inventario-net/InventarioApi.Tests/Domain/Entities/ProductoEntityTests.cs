using InventarioApi.Domain.Entities;
using InventarioApi.Domain.Exceptions;

namespace InventarioApi.Tests.Domain.Entities
{
    public class ProductoEntityTests
    {
        [Fact]
        public void Crear_ConDatosValidos_RetornaProductoCorrectamente()
        {
            var nombre = "Laptop Dell";
            var descripcion = "Laptop profesional";
            var precio = 4500000m;
            var cantidad = 10;

            var producto = Producto.Crear(nombre, descripcion, precio, cantidad);

            Assert.Equal(nombre, producto.Nombre);
            Assert.Equal(descripcion, producto.Descripcion);
            Assert.Equal(precio, producto.Precio);
            Assert.Equal(cantidad, producto.Cantidad.Valor);
        }

        [Theory]
        [InlineData("")]
        [InlineData("   ")]
        [InlineData(null)]
        public void Crear_ConNombreVacioONulo_LanzaDomainException(string? nombre)
        {
            Assert.Throws<DomainException>(() =>
                Producto.Crear(nombre!, "desc", 1000m, 5));
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        [InlineData(-100)]
        public void Crear_ConPrecioMenorOIgualACero_LanzaDomainException(decimal precio)
        {
            Assert.Throws<DomainException>(() =>
                Producto.Crear("Producto", "desc", precio, 5));
        }

        [Fact]
        public void DescontarStock_ConUnidadesValidas_ActualizaCantidadCorrectamente()
        {
            var producto = Producto.Crear("Producto", "desc", 1000m, 10);

            producto.DescontarStock(3);

            Assert.Equal(7, producto.Cantidad.Valor);
        }

        [Fact]
        public void DescontarStock_ConUnidadesMayoresAlStock_LanzaInvalidOperationException()
        {
            var producto = Producto.Crear("Producto", "desc", 1000m, 5);

            Assert.Throws<InvalidOperationException>(() => producto.DescontarStock(10));
        }

        [Fact]
        public void DescontarStock_ConCantidadExacta_DejaStockEnCero()
        {
            var producto = Producto.Crear("Producto", "desc", 1000m, 5);

            producto.DescontarStock(5);

            Assert.Equal(0, producto.Cantidad.Valor);
        }
    }
}
