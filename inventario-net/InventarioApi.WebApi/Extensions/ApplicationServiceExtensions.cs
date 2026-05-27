using InventarioApi.Application.Ports;
using InventarioApi.Application.Services;
using InventarioApi.Domain.Services;

namespace InventarioApi.WebApi.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IProductoDomainService, ProductoDomainService>();
            services.AddScoped<IProductoAppService, ProductoAppService>();
            return services;
        }
    }
}
