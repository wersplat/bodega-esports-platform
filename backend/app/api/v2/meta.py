# FastAPI imports
from fastapi import APIRouter, Depends

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession

# Project imports
from app.api.v2.responses import SingleResponse
from app.database import get_db

# Type imports
from typing import Dict, Any
from pydantic import BaseModel
import platform
import os

router = APIRouter(
    prefix="/api/v2",
    tags=["Meta"],
    responses={
        404: {"description": "Resource not found"},
        500: {"description": "Server error"}
    }
)


class VersionInfo(BaseModel):
    api_version: str = "2.0.0"
    python_version: str = platform.python_version()
    system: str = platform.system()
    release: str = platform.release()


class HealthCheckData(BaseModel):
    status: str = "ok"
    service: str = "Bodega Esports Platform API"
    version: str = "2.0.0"
    database: str = "connected"


@router.get("/version", response_model=SingleResponse[VersionInfo])
async def get_version():
    """Get API version information"""
    return SingleResponse(
        item=VersionInfo()
    )


@router.get("/health", response_model=SingleResponse[HealthCheckData])
async def health_check(db: AsyncSession = Depends(get_db)):
    """Check API health status"""
    health_data = HealthCheckData()
    
    try:
        # Test database connection
        async with db.begin():
            await db.execute("SELECT 1")
    except Exception:
        health_data.database = "disconnected"
        health_data.status = "error"
    
    return SingleResponse(item=health_data)


@router.get("/config", response_model=SingleResponse[Dict[str, Any]])
async def get_config():
    """Get API configuration"""
    # Only return non-sensitive configuration
    config = {
        "cors_origins": [
            "http://localhost:3000", 
            "https://dashboard.bodegacatsgc.gg",
            "https://api.bodegacatsgc.gg"
        ],
        "environment": os.getenv("ENVIRONMENT", "development"),
        "debug": os.getenv("DEBUG", "false").lower() == "true",
        "features": {
            "webhooks": True,
            "analytics": True,
            "discord_integration": True
        }
    }
    
    return SingleResponse(item=config)
