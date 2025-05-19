from fastapi import HTTPException, status, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import httpx
from app.config import settings
from typing import Optional, Dict, Any
from fastapi import APIRouter
# Security scheme for Bearer token
token_auth_scheme = HTTPBearer()

async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(token_auth_scheme)
) -> Dict[str, Any]:
    """
    Validate the JWT token with the auth-service.
    This should be used as a dependency in your route handlers.
    """
    token = credentials.credentials
    
    try:
        # First, verify the token locally (fast, but less secure)
        # This is optional but can reduce auth-service load
        try:
            # This just validates the token format, not the signature
            # Real validation happens with the auth-service
            _ = jwt.get_unverified_claims(token)
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token format",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Then validate with the auth-service
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.AUTH_SERVICE_URL}/api/me",
                headers={"Authorization": f"Bearer {token}"}
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired token",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            user_data = response.json()
            # Attach user data to the request for use in route handlers
            request.state.user = user_data
            return user_data
            
    except httpx.RequestError as e:
        # Handle connection errors to the auth-service
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service unavailable",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Optional: Role-based access control
def require_role(required_role: str):
    """
    Dependency to require a specific role for a route.
    Usage: @router.get("/admin", dependencies=[Depends(require_role("admin"))])
    """
    async def role_checker(
        user: Dict[str, Any] = Depends(get_current_user)
    ) -> bool:
        if user.get("role") != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required role: {required_role}",
            )
        return True
    
    return role_checker

auth_router = APIRouter()

# Example route (optional)
@auth_router.get("/me")
async def me(user=Depends(get_current_user)):
    return user