using InventarioApi.Application.DTOs;
using InventarioApi.Application.Ports;
using Microsoft.AspNetCore.Mvc;

namespace InventarioApi.WebApi.Controllers.v1
{
    /// <summary>
    /// Gestión de productos del inventario.
    /// </summary>
    [ApiController]
    [Route("api/v1/productos")]
    [Produces("application/json")]
    public class ProductosController(IProductoAppService productoAppService) : ControllerBase
    {
        private readonly IProductoAppService _productoAppService = productoAppService;

        /// <summary>
        /// Registra un nuevo producto en el inventario.
        /// </summary>
        /// <param name="request">Datos del producto a registrar.</param>
        /// <param name="cancellationToken">Token de cancelación de la operación.</param>
        /// <returns>El producto recién creado con su identificador asignado.</returns>
        /// <remarks>
        /// Ejemplo de request:
        ///
        ///     POST /api/v1/productos
        ///     {
        ///         "nombre": "Laptop Dell XPS 15",
        ///         "descripcion": "Laptop profesional con procesador Intel i7",
        ///         "precio": 4500000,
        ///         "cantidad": 10
        ///     }
        ///
        /// </remarks>
        [HttpPost]
        [ProducesResponseType(typeof(ProductoResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> Crear(
            [FromBody] CrearProductoRequest request,
            CancellationToken cancellationToken)
        {
            var producto = await _productoAppService.CrearAsync(request, cancellationToken);
            return CreatedAtAction(nameof(Crear), new { id = producto.Id }, producto);
        }

        /// <summary>
        /// Actualiza los datos de un producto existente.
        /// </summary>
        /// <param name="id">Identificador único del producto a actualizar.</param>
        /// <param name="request">Nuevos datos del producto.</param>
        /// <param name="cancellationToken">Token de cancelación de la operación.</param>
        /// <returns>El producto con los datos actualizados.</returns>
        /// <remarks>
        /// Ejemplo de request:
        ///
        ///     PUT /api/v1/productos/1
        ///     {
        ///         "nombre": "Laptop Dell XPS 15 Pro",
        ///         "descripcion": "Laptop profesional actualizada",
        ///         "precio": 4800000,
        ///         "cantidad": 8
        ///     }
        ///
        /// </remarks>
        [HttpPut("{id:int}")]
        [ProducesResponseType(typeof(ProductoResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> Actualizar(
            [FromRoute] int id,
            [FromBody] ActualizarProductoRequest request,
            CancellationToken cancellationToken)
        {
            var producto = await _productoAppService.ActualizarAsync(id, request, cancellationToken);
            return Ok(producto);
        }

        /// <summary>
        /// Descuenta unidades del stock disponible de un producto.
        /// </summary>
        /// <param name="id">Identificador único del producto al que se le descontará stock.</param>
        /// <param name="request">Cantidad de unidades a descontar.</param>
        /// <param name="cancellationToken">Token de cancelación de la operación.</param>
        /// <returns>El producto con la cantidad de stock actualizada.</returns>
        /// <remarks>
        /// Ejemplo de request:
        ///
        ///     PATCH /api/v1/productos/1/stock/descontar
        ///     {
        ///         "unidades": 3
        ///     }
        ///
        /// Retorna 422 si las unidades solicitadas superan el stock disponible.
        /// </remarks>
        [HttpPatch("{id:int}/stock/descontar")]
        [ProducesResponseType(typeof(ProductoResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
        public async Task<IActionResult> DescontarStock(
            [FromRoute] int id,
            [FromBody] DescontarStockRequest request,
            CancellationToken cancellationToken)
        {
            var producto = await _productoAppService.DescontarStockAsync(id, request, cancellationToken);
            return Ok(producto);
        }
    }
}