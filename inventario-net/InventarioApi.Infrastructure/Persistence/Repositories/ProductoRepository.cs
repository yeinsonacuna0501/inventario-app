using InventarioApi.Domain.Entities;
using InventarioApi.Domain.Repositories;
using Microsoft.EntityFrameworkCore;

namespace InventarioApi.Infrastructure.Persistence.Repositories
{
    public class ProductoRepository(AppDbContext context) : IProductoRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<Producto?> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default) =>
            await _context.Productos.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        public async Task<bool> ExisteConNombreAsync(string nombre,int? excluirId = null,CancellationToken cancellationToken = default)
        {
            var query = _context.Productos.AsNoTracking().Where(p => EF.Functions.Like(p.Nombre.ToUpper(), nombre.ToUpper()));

            if (excluirId.HasValue)
                query = query.Where(p => p.Id != excluirId.Value);

            return await query.AnyAsync(cancellationToken);
        }

        public async Task<int> AgregarAsync(Producto producto, CancellationToken cancellationToken = default)
        {
            await _context.Productos.AddAsync(producto, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return producto.Id;
        }

        public async Task ActualizarAsync(Producto producto, CancellationToken cancellationToken = default)
        {
            _context.Productos.Update(producto);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
