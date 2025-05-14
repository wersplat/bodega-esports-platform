from pydantic import BaseModel, Field
from typing import TypeVar, Generic, List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

T = TypeVar('T')

class ResponseStatus(str, Enum):
    SUCCESS = "success"
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"

class Pagination(BaseModel):
    total: int = Field(description="Total number of items")
    page: int = Field(description="Current page number")
    per_page: int = Field(description="Number of items per page")
    total_pages: int = Field(description="Total number of pages")

class BaseResponse(BaseModel, Generic[T]):
    success: bool = Field(default=True, description="Request success status")
    status: ResponseStatus = Field(default=ResponseStatus.SUCCESS, description="Response status")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")
    version: str = Field(default="2.0", description="API version")
    message: Optional[str] = Field(default=None, description="Optional response message")
    error_code: Optional[str] = Field(default=None, description="Optional error code")

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True

class ListResponse(BaseResponse[T]):
    items: List[T] = Field(description="List of items")
    pagination: Pagination = Field(description="Pagination information")

class SingleResponse(BaseResponse[T]):
    item: T = Field(description="Single item")

class CountResponse(BaseResponse):
    count: int = Field(description="Total count of items")

class MetadataResponse(BaseResponse):
    metadata: Dict[str, Any] = Field(description="Additional metadata")

class StatusResponse(BaseResponse):
    status: ResponseStatus = Field(description="Current system status")
    details: Optional[Dict[str, Any]] = Field(default=None, description="Additional status details")
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
