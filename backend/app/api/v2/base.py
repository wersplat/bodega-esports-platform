from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List, Type, TypeVar, Union
from fastapi import HTTPException, status
from enum import Enum
from datetime import datetime

T = TypeVar('T')

class ErrorType(str, Enum):
    VALIDATION = "validation"
    AUTH = "auth"
    NOT_FOUND = "not_found"
    CONFLICT = "conflict"
    INTERNAL = "internal"
    BAD_REQUEST = "bad_request"

class ErrorDetail(BaseModel):
    code: str = Field(description="Error code identifier")
    message: str = Field(description="Human-readable error message")
    type: ErrorType = Field(description="Error type category")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")
    details: Optional[Dict[str, Any]] = Field(default=None, description="Additional error details")

class APIError(Exception):
    def __init__(
        self, 
        code: str, 
        message: str, 
        error_type: ErrorType, 
        status_code: int = status.HTTP_400_BAD_REQUEST, 
        details: Optional[Dict[str, Any]] = None
    ) -> None:
        self.code = code
        self.message = message
        self.error_type = error_type
        self.status_code = status_code
        self.details = details
        super().__init__(message)

def raise_error(
    code: str, 
    message: str, 
    error_type: ErrorType = ErrorType.BAD_REQUEST, 
    status_code: int = status.HTTP_400_BAD_REQUEST, 
    details: Optional[Dict[str, Any]] = None
) -> None:
    raise HTTPException(
        status_code=status_code,
        detail=ErrorDetail(
            code=code,
            message=message,
            type=error_type,
            details=details
        ).dict()
    )

def not_found_error(
    message: str = "Resource not found", 
    details: Optional[Dict[str, Any]] = None
) -> None:
    raise_error(
        code="NOT_FOUND",
        message=message,
        error_type=ErrorType.NOT_FOUND,
        status_code=status.HTTP_404_NOT_FOUND,
        details=details
    )

def conflict_error(
    message: str = "Resource conflict", 
    details: Optional[Dict[str, Any]] = None
) -> None:
    raise_error(
        code="CONFLICT",
        message=message,
        error_type=ErrorType.CONFLICT,
        status_code=status.HTTP_409_CONFLICT,
        details=details
    )

def validation_error(
    errors: List[Dict[str, Any]], 
    message: str = "Input validation failed"
) -> None:
    raise_error(
        code="VALIDATION_ERROR",
        message=message,
        error_type=ErrorType.VALIDATION,
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        details={"errors": errors}
    )
        details={"errors": errors}
    )

def not_found_error(resource: str, identifier: Any):
    raise_error(
        code="NOT_FOUND",
        message=f"{resource} not found",
        details={"identifier": identifier}
    )

def conflict_error(resource: str, details: Dict[str, Any]):
    raise_error(
        code="CONFLICT",
        message=f"{resource} already exists",
        details=details
    )

def internal_error(message: str = "Internal server error", details: Optional[Dict[str, Any]] = None):
    raise_error(
        code="INTERNAL_ERROR",
        message=message,
        status_code=500,
        details=details
    )
