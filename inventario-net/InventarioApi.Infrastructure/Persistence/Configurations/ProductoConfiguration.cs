using InventarioApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace InventarioApi.Infrastructure.Persistence.Configurations
{
    public class ProductoConfiguration : IEntityTypeConfiguration<Producto>
    {
        public void Configure(EntityTypeBuilder<Producto> builder)
        {
            builder.ToTable("PRODUCTOS");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Id)
                .HasColumnName("ID")
                .ValueGeneratedOnAdd()
                .UseSequence("SEQ_PRODUCTOS"); 

            builder.Property(p => p.Nombre)
                .HasColumnName("NOMBRE")
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(p => p.Descripcion)
                .HasColumnName("DESCRIPCION")
                .HasMaxLength(500);

            builder.Property(p => p.Precio)
                .HasColumnName("PRECIO")
                .HasColumnType("NUMBER(12,2)")
                .IsRequired();

            builder.Property(p => p.FechaRegistro)
                .HasColumnName("FECHA_REGISTRO")
                .IsRequired();

            builder.OwnsOne(p => p.Cantidad, cantidad =>
            {
                cantidad.Property(c => c.Valor)
                    .HasColumnName("CANTIDAD")
                    .IsRequired();
            });

            builder.HasIndex(p => p.Nombre)
                .HasDatabaseName("IDX_PRODUCTOS_NOMBRE");
        }
    }
}
