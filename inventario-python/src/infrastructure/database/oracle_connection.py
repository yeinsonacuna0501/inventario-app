import os
from contextlib import contextmanager
from typing import Generator
import oracledb

try:
    oracledb.init_oracle_client()
except Exception:
    pass 

def crear_pool_de_conexiones() -> oracledb.SessionPool:
    host = os.getenv("ORACLE_HOST", "localhost")
    port = os.getenv("ORACLE_PORT", "1521")
    sid = os.getenv("ORACLE_SID", "xe")
    
    dsn_string = f"{host}:{port}/{sid}"

    return oracledb.SessionPool(
        user=os.getenv("ORACLE_USER", "system"),
        password=os.getenv("ORACLE_PASSWORD", ""),
        dsn=dsn_string,
        min=2,
        max=10,
        increment=1,
        encoding="UTF-8",
    )


pool: oracledb.SessionPool = crear_pool_de_conexiones()

@contextmanager
def obtener_conexion() -> Generator[oracledb.Connection, None, None]:
    conexion = pool.acquire()
    try:
        yield conexion
    finally:
        pool.release(conexion)