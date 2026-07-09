from contextlib import asynccontextmanager

from fastapi import FastAPI

from core.config import settings
from core.database import create_db_and_tables
from routers.auth import auth_router
from routers.health import router as health_router


@asynccontextmanager
async def lifespan(app: FastAPI):
  create_db_and_tables()
  yield


def create_app() -> FastAPI:
  app = FastAPI(
    title="Library Management System API",
    version="0.1.0",
    debug=settings.debug,
    lifespan=lifespan,
  )
  app.include_router(health_router)
  app.include_router(auth_router)
  return app


app = create_app()
