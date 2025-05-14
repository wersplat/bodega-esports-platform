# FastAPI imports
from fastapi import APIRouter, Depends, Query, Path

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
    tags=["Contracts"],
    responses={
        404: {"description": "Contract not found"},
        400: {"description": "Invalid parameters"},
        409: {"description": "Conflict"}
    }
)


class ContractStatus(str, Enum):
    DRAFT = "draft"
    PENDING = "pending"
    ACTIVE = "active"
    EXPIRED = "expired"
    TERMINATED = "terminated"


class ContractBase(BaseModel):
    title: str
    description: Optional[str] = None
    team_id: Optional[str] = None
    profile_id: Optional[str] = None
    start_date: date
    end_date: Optional[date] = None
    terms: Dict[str, Any]
    status: ContractStatus = ContractStatus.DRAFT


class ContractCreate(ContractBase):
    pass


class ContractUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    team_id: Optional[str] = None
    profile_id: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    terms: Optional[Dict[str, Any]] = None
    status: Optional[ContractStatus] = None


class ContractResponse(ContractBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True


# Mock contracts storage (replace with actual database models when available)
contracts_db = {}


@router.get("", response_model=ListResponse[ContractResponse])
async def get_contracts(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[ContractStatus] = Query(None),
    team_id: Optional[str] = Query(None),
    profile_id: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Get a list of contracts"""
    # Filter contracts by query parameters
    filtered_contracts = list(contracts_db.values())
    
    if status:
        filtered_contracts = [c for c in filtered_contracts if c.status == status]
    
    if team_id:
        filtered_contracts = [c for c in filtered_contracts if c.team_id == team_id]
    
    if profile_id:
        filtered_contracts = [c for c in filtered_contracts if c.profile_id == profile_id]
    
    # Apply pagination
    total = len(filtered_contracts)
    paginated_contracts = filtered_contracts[skip:skip + limit]
    
    return ListResponse(
        items=paginated_contracts,
        pagination={
            "total": total,
            "page": skip // limit + 1,
            "per_page": limit,
            "total_pages": (total + limit - 1) // limit
        }
    )


@router.get("/{contract_id}", response_model=SingleResponse[ContractResponse])
async def get_contract(
    contract_id: str = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Get a contract by ID"""
    if contract_id not in contracts_db:
        not_found_error(f"Contract with ID {contract_id} not found")
    
    return SingleResponse(item=contracts_db[contract_id])


@router.post("", response_model=SingleResponse[ContractResponse], status_code=201)
async def create_contract(
    contract: ContractCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new contract"""
    # Validate dates
    if contract.end_date and contract.start_date > contract.end_date:
        raise_error(
            code="INVALID_DATE_RANGE",
            message="End date must be after start date",
            status_code=400
        )
    
    # Create new contract
    contract_id = str(uuid.uuid4())
    now = datetime.utcnow()
    
    new_contract = ContractResponse(
        **contract.dict(),
        id=contract_id,
        created_at=now,
        updated_at=now
    )
    
    contracts_db[contract_id] = new_contract
    
    return SingleResponse(item=new_contract)


@router.patch("/{contract_id}", response_model=SingleResponse[ContractResponse])
async def update_contract(
    contract_update: ContractUpdate,
    contract_id: str = Path(...),
    db: AsyncSession = Depends(get_db)
):
    """Update a contract"""
    if contract_id not in contracts_db:
        not_found_error(f"Contract with ID {contract_id} not found")
    
    existing_contract = contracts_db[contract_id]
    
    # Update fields
    update_data = contract_update.dict(exclude_unset=True)
    updated_contract_dict = existing_contract.dict()
    updated_contract_dict.update(update_data)
    updated_contract_dict["updated_at"] = datetime.utcnow()
    
    # Validate dates if both are provided
    if "start_date" in update_data and "end_date" in update_data:
        if update_data["end_date"] and update_data["start_date"] > update_data["end_date"]:
            raise_error(
                code="INVALID_DATE_RANGE",
                message="End date must be after start date",
                status_code=400
            )
    elif "start_date" in update_data and existing_contract.end_date:
        if update_data["start_date"] > existing_contract.end_date:
            raise_error(
                code="INVALID_DATE_RANGE",
                message="End date must be after start date",
                status_code=400
            )
    elif "end_date" in update_data and update_data["end_date"]:
        if existing_contract.start_date > update_data["end_date"]:
            raise_error(
                code="INVALID_DATE_RANGE",
                message="End date must be after start date",
                status_code=400
            )
    
    updated_contract = ContractResponse(**updated_contract_dict)
    contracts_db[contract_id] = updated_contract
    
    return SingleResponse(item=updated_contract)
