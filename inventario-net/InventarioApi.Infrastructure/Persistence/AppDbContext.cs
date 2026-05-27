using InventarioApi.Domain.Entities;
using InventarioApi.Infrastructure.Persistence.Configurations;
using Microsoft.EntityFrameworkCore;

namespace InventarioApi.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Producto> Productos => Set<Producto>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new ProductoConfiguration());
            base.OnModelCreating(modelBuilder);
        }
    }
}
