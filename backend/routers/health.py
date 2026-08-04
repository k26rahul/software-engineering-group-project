from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_class=JSONResponse)
async def health_check():
  """Returns a simple liveness check response."""
  return {"status": "ok", "version": "0.1.0"}
