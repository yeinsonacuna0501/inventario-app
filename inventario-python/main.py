from dotenv import load_dotenv 
load_dotenv()
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.api.routers.productos_router import router as productos_router

app = FastAPI(
    title="Inventario Python API",
    description="Servicio de consulta de productos por nombre y fecha",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def manejador_global_de_excepciones(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={
            "status": 500,
            "error": "InternalServerError",
            "mensaje": "Ocurrió un error inesperado. Por favor intente nuevamente.",
        },
    )


app.include_router(productos_router)


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "inventario-python"}