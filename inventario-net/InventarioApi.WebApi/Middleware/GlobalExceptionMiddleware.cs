using InventarioApi.Domain.Exceptions;
using System.Net;
using System.Text.Json;

namespace InventarioApi.WebApi.Middleware
{
    public class GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        private readonly RequestDelegate _next = next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger = logger;

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Excepción no controlada: {Message}", exception.Message);
                await ManejarExcepcionAsync(context, exception);
            }
        }

        private static async Task ManejarExcepcionAsync(HttpContext context, Exception exception)
        {
            var (statusCode, mensaje) = exception switch
            {
                ProductoNotFoundException => (HttpStatusCode.NotFound, exception.Message),
                DomainException => (HttpStatusCode.UnprocessableEntity, exception.Message),
                ArgumentException => (HttpStatusCode.BadRequest, exception.Message),
                _ => (HttpStatusCode.InternalServerError, "Ocurrió un error inesperado. Por favor intente nuevamente.")
            };

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var respuesta = new
            {
                status = (int)statusCode,
                error = statusCode.ToString(),
                mensaje
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(respuesta));
        }
    }
}
