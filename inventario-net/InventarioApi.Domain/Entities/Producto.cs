using InventarioApi.Domain.Exceptions;
using InventarioApi.Domain.ValueObjects;

namespace InventarioApi.Domain.Entities
{
    public class Producto
    {
        public int Id { get; private set; }
        public string Nombre { get; private set; }
        public string Descripcion { get; private set; }
        public decimal Precio { get; private set; }
        public Cantidad Cantidad { get; private set; }
        public DateTime FechaRegistro { get; private set; }

        private Producto()
        {
            Nombre = null!;
            Descripcion = null!;
            Cantidad = null!;
        }

        public static Producto Crear(string nombre, string descripcion, decimal precio, int cantidad)
        {
            ValidarNombre(nombre);
            ValidarPrecio(precio);

            return new Producto
            {
                Nombre = nombre.Trim(),
                Descripcion = descripcion?.Trim() ?? string.Empty,
                Precio = precio,
                Cantidad = new Cantidad(cantidad),
                FechaRegistro = DateTime.UtcNow
            };
        }

        public void Actualizar(string nombre, string descripcion, decimal precio, int cantidad)
        {
            ValidarNombre(nombre);
            ValidarPrecio(precio);

            Nombre = nombre.Trim();
            Descripcion = descripcion?.Trim() ?? string.Empty;
            Precio = precio;
            Cantidad = new Cantidad(cantidad);
        }

        public void DescontarStock(int unidades)
        {
            Cantidad = Cantidad.Decrementar(unidades);
        }

        private static void ValidarNombre(string nombre)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                throw new DomainException("El nombre del producto es obligatorio.");

            if (nombre.Trim().Length > 150)
                throw new DomainException("El nombre del producto no puede superar los 150 caracteres.");
        }

        private static void ValidarPrecio(decimal precio)
        {
            if (precio <= 0)
                throw new DomainException("El precio del producto debe ser mayor a cero.");
        }
    }
}
