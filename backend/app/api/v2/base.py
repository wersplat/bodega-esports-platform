from pydantic import BaseModel
from typing import Optional, Dict, Any
from fastapi import HTTPException

class ErrorDetail(BaseModel):
    code: str
    message: str
    details: Optional[Dict[str, Any]] = None

class APIError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400, details: Optional[Dict[str, Any]] = None):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(message)

def raise_error(code: str, message: str, status_code: int = 400, details: Optional[Dict[str, Any]] = None):
    raise HTTPException(
        status_code=status_code,
        detail=ErrorDetail(
            code=code,
            message=message,
            details=details
        ).dict()
    )

def validation_error(errors: Dict[str, Any]):
    raise_error(
        code="VALIDATION_ERROR",
        message="Input validation failed",
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
