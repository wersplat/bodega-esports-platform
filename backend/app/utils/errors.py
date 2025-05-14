from enum import Enum
from typing import Optional, Dict, Any
from datetime import datetime

from fastapi import HTTPException, status
from pydantic import BaseModel

class ErrorType(str, Enum):
    VALIDATION = "validation"
    AUTH = "auth"
    NOT_FOUND = "not_found"
    CONFLICT = "conflict"
    INTERNAL = "internal"
    BAD_REQUEST = "bad_request"

class ErrorDetail(BaseModel):
    code: str = "ERROR"
    message: str = "An error occurred"
    type: ErrorType = ErrorType.INTERNAL
    timestamp: datetime = datetime.utcnow()
    details: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True

def raise_error(
    code: str = "ERROR",
    message: str = "An error occurred",
    error_type: ErrorType = ErrorType.INTERNAL,
    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
    details: Optional[Dict[str, Any]] = None
) -> None:
    """Raise a standardized error with proper formatting."""
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
    resource: str,
    identifier: Any,
    message: Optional[str] = None
) -> None:
    """Raise a not found error for a specific resource."""
    raise_error(
        code=f"{resource.upper()}_NOT_FOUND",
        message=message or f"{resource.title()} not found",
        error_type=ErrorType.NOT_FOUND,
        status_code=status.HTTP_404_NOT_FOUND,
        details={"identifier": identifier}
    )

def conflict_error(
    resource: str,
    details: Dict[str, Any],
    message: Optional[str] = None
) -> None:
    """Raise a conflict error for a specific resource."""
    raise_error(
        code=f"{resource.upper()}_CONFLICT",
        message=message or f"{resource.title()} conflict",
        error_type=ErrorType.CONFLICT,
        status_code=status.HTTP_409_CONFLICT,
        details=details
    )
