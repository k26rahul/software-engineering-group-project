from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from core.config import settings
from core.database import create_db_and_tables, engine
from core.seeding import (
  seed_books,
  seed_default_users,
  seed_members,
  seed_purchase_requests,
  seed_reservations,
  seed_reviews,
  seed_subscriptions,
  seed_transactions,
)
from routers.auth import auth_router
from routers.books import books_router
from routers.budget import budget_router
from routers.dashboard import dashboard_router
from routers.health import router as health_router
from routers.members import members_router
from routers.payments import payments_router
from routers.recommendations import recommendations_router
from routers.reports import reports_router
from routers.reservations import reservations_router
from routers.transactions import transactions_router


@asynccontextmanager
async def lifespan(app: FastAPI):
  create_db_and_tables()
  with Session(engine) as session:
    seed_default_users(session)
    seed_members(session)
    seed_books(session)
    seed_transactions(session)
    seed_reservations(session)
    seed_reviews(session)
    seed_purchase_requests(session)
    seed_subscriptions(session)
  yield


def create_app() -> FastAPI:
  app = FastAPI(
    title="Library Management System API",
    version="0.1.0",
    debug=settings.debug,
    lifespan=lifespan,
  )
  app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )
  app.include_router(health_router)
  app.include_router(auth_router)
  app.include_router(books_router)
  app.include_router(budget_router)
  app.include_router(members_router)
  app.include_router(payments_router)
  app.include_router(transactions_router)
  app.include_router(reservations_router)
  app.include_router(recommendations_router)
  app.include_router(reports_router)
  app.include_router(dashboard_router)
  return app


app = create_app()
