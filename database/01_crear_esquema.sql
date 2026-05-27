CREATE SEQUENCE seq_productos
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

CREATE TABLE productos (
    id               NUMBER          DEFAULT seq_productos.NEXTVAL PRIMARY KEY,
    nombre           VARCHAR2(150)   NOT NULL,
    descripcion      VARCHAR2(500),
    precio           NUMBER(12, 2)   NOT NULL,
    cantidad         NUMBER(10)      NOT NULL,
    fecha_registro   DATE            DEFAULT SYSDATE NOT NULL,
    CONSTRAINT chk_precio_positivo   CHECK (precio > 0),
    CONSTRAINT chk_cantidad_positiva CHECK (cantidad >= 0)
);

CREATE INDEX idx_productos_nombre         ON productos(UPPER(nombre));
CREATE INDEX idx_productos_fecha_registro ON productos(fecha_registro);

COMMENT ON TABLE  productos                  IS 'Tabla principal de inventario de productos';
COMMENT ON COLUMN productos.id               IS 'Identificador unico generado por secuencia';
COMMENT ON COLUMN productos.nombre           IS 'Nombre del producto';
COMMENT ON COLUMN productos.descripcion      IS 'Descripcion detallada del producto';
COMMENT ON COLUMN productos.precio           IS 'Precio unitario del producto';
COMMENT ON COLUMN productos.cantidad         IS 'Cantidad disponible en inventario';
COMMENT ON COLUMN productos.fecha_registro   IS 'Fecha en que se registro el producto';
