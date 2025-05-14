from pydantic import BaseModel
from typing import TypeVar, Generic, List, Optional, Dict, Any
from datetime import datetime

class Pagination(BaseModel):
    total: int
    page: int
    per_page: int
    total_pages: int

class BaseResponse(BaseModel):
    success: bool = True
    timestamp: datetime = datetime.utcnow()
    version: str = "2.0"

class ListResponse(BaseResponse, Generic[TypeVar('T')]):
    items: List[T]
    pagination: Pagination

class SingleResponse(BaseResponse, Generic[TypeVar('T')]):
    item: T

class CountResponse(BaseResponse):
    count: int

class MetadataResponse(BaseResponse):
    metadata: Dict[str, Any]

class StatusResponse(BaseResponse):
    status: str
    message: Optional[str] = None

class ErrorResponse(BaseResponse):
    error: str
    code: str
    details: Optional[Dict[str, Any]] = None

class HealthCheckResponse(BaseResponse):
    status: str
    version: str
    timestamp: datetime
    environment: str
    services: Dict[str, str]
