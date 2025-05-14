# FastAPI imports
from fastapi import APIRouter, Depends, Query, Path, BackgroundTasks

# Database imports
from sqlalchemy.ext.asyncio import AsyncSession

# Project imports
from app.api.v2.base import raise_error, not_found_error
from app.api.v2.responses import ListResponse, SingleResponse
from app.database import get_db

# Type imports
from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime, date
from enum import Enum
import uuid

router = APIRouter(
    prefix="/api/v2",
    tags=["Payments"],
    responses={
        404: {"description": "Payment not found"},
        400: {"description": "Invalid parameters"},
        409: {"description": "Conflict"},
        402: {"description": "Payment required"}
    }
)


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"
    CANCELLED = "cancelled"


class PaymentMethod(str, Enum):
    CREDIT_CARD = "credit_card"
    PAYPAL = "paypal"
    BANK_TRANSFER = "bank_transfer"
    STRIPE = "stripe"
    OTHER = "other"


class PaymentBase(BaseModel):
    amount: float
    currency: str = "USD"
    description: str
    profile_id: Optional[str] = None
    team_id: Optional[str] = None
    method: PaymentMethod
    status: PaymentStatus = PaymentStatus.PENDING
    external_reference: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class PaymentCreate(PaymentBase):
    pass


class PaymentUpdate(BaseModel):
    status: Optional[PaymentStatus] = None
    external_reference: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class PaymentResponse(PaymentBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Mock payments storage (replace with actual database models when available)
payments_db = {}


@router.get("", response_model=ListResponse[PaymentResponse])
async def get_payments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    profile_id: Optional[str] = Query(None),
    team_id: Optional[str] = Query(None),
    status: Optional[PaymentStatus] = Query(None),
    method: Optional[PaymentMethod] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Get a list of payments"""
    # Filter payments by query parameters
    filtered_payments = list(payments_db.values())
    
    if profile_id:
        filtered_payments = [p for p in filtered_payments if p.profile_id == profile_id]
    
    if team_id:
        filtered_payments = [p for p in filtered_payments if p.team_id == team_id]
    
    if status:
        filtered_payments = [p for p in filtered_payments if p.status == status]
    
    if method:
        filtered_payments = [p for p in filtered_payments if p.method == method]
    
    if start_date:
        filtered_payments = [p for p in filtered_payments if p.created_at.date() >= start_date]
    
    if end_date:
        filtered_payments = [p for p in filtered_payments if p.created_at.date() <= end_date]
    
    # Apply pagination
    total = len(filtered_payments)
    paginated_payments = filtered_payments[skip:skip + limit]
    
    return ListResponse(
        items=paginated_payments,
        pagination={
            "total": total,
            "page": skip // limit + 1,
            "per_page": limit,
            "total_pages": (total + limit - 1) // limit
        }
    )


@router.get("/{payment_id}", response_model=SingleResponse[PaymentResponse])
async def get_payment(
    payment_id: str = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Get a payment by ID"""
    if payment_id not in payments_db:
        not_found_error(f"Payment with ID {payment_id} not found")
    
    return SingleResponse(item=payments_db[payment_id])


@router.post("", response_model=SingleResponse[PaymentResponse], status_code=201)
async def create_payment(
    payment: PaymentCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Create a new payment"""
    # Validate amount
    if payment.amount <= 0:
        raise_error(
            code="INVALID_AMOUNT",
            message="Payment amount must be greater than zero",
            status_code=400
        )
    
    # Create new payment
    payment_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    new_payment = PaymentResponse(
        **payment.dict(),
        id=payment_id,
        created_at=now,
        updated_at=now
    )
    
    payments_db[payment_id] = new_payment
    
    # Process payment in background (mock implementation)
    background_tasks.add_task(process_payment, payment_id)
    
    return SingleResponse(item=new_payment)


@router.patch("/{payment_id}", response_model=SingleResponse[PaymentResponse])
async def update_payment(
    payment_update: PaymentUpdate,
    payment_id: str = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Update a payment"""
    if payment_id not in payments_db:
        not_found_error(f"Payment with ID {payment_id} not found")
    
    existing_payment = payments_db[payment_id]
    
    # Update fields
    update_data = payment_update.dict(exclude_unset=True)
    updated_payment_dict = existing_payment.dict()
    updated_payment_dict.update(update_data)
    updated_payment_dict["updated_at"] = datetime.utcnow()
    
    updated_payment = PaymentResponse(**updated_payment_dict)
    payments_db[payment_id] = updated_payment
    
    return SingleResponse(item=updated_payment)


# Mock function for processing payments
async def process_payment(payment_id: str):
    """Process a payment (mock implementation)"""
    if payment_id in payments_db:
        payment = payments_db[payment_id]
        
        # Simulate payment processing
        payment.status = PaymentStatus.PROCESSING
        # In a real implementation, this would call a payment gateway
        
        # Update payment status after processing
        payment.status = PaymentStatus.COMPLETED
        payment.updated_at = datetime.utcnow()
        payments_db[payment_id] = payment
