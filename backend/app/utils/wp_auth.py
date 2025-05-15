from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
import os
from typing import Dict, Any, Optional

# Initialize HTTP Bearer token security
wp_security = HTTPBearer()

async def verify_wp_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(wp_security)) -> Dict[str, Any]:
    """
    Verify WordPress JWT token for any valid user
    
    Args:
        credentials: The HTTP Authorization header containing the Bearer token
    
    Returns:
        Dict containing the decoded JWT payload if token is valid
        
    Raises:
        HTTPException: If token is invalid or missing required claims
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    token = credentials.credentials
    try:
        # Verify the token
        payload = jwt.decode(
            token,
            os.getenv("WP_SYNC_SECRET", ""),  # Make sure to set this in your environment
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        
        # Verify required WordPress claims
        required_claims = ['wp_user_id', 'wp_username']
        if not all(claim in payload for claim in required_claims):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Missing required user claims in token"
            )
            
        return payload
        
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )