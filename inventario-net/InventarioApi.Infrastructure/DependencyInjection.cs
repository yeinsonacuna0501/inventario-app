using InventarioApi.Domain.Repositories;
using InventarioApi.Infrastructure.Persistence;
using InventarioApi.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace InventarioApi.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services,IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseOracle(
                    configuration.GetConnectionString("OracleDB"),
                    oracle => oracle.UseOracleSQLCompatibility(OracleSQLCompatibility.DatabaseVersion21)
                ));

            services.AddScoped<IProductoRepository, ProductoRepository>();

            return services;
        }
    }
}
