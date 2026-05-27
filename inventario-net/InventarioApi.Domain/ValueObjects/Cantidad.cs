namespace InventarioApi.Domain.ValueObjects
{
    public sealed record Cantidad
    {
        public int Valor { get; }

        public Cantidad(int valor)
        {
            if (valor < 0)
                throw new ArgumentException("La cantidad no puede ser negativa.", nameof(valor));

            Valor = valor;
        }

        public Cantidad Decrementar(int unidades)
        {
            if (unidades <= 0)
                throw new ArgumentException("Las unidades a decrementar deben ser mayores a cero.", nameof(unidades));

            if (unidades > Valor)
                throw new InvalidOperationException($"No hay suficiente stock. Disponible: {Valor}, solicitado: {unidades}.");

            return new Cantidad(Valor - unidades);
        }

        public static implicit operator int(Cantidad cantidad) => cantidad.Valor;
        public static explicit operator Cantidad(int valor) => new(valor);
    }

}
