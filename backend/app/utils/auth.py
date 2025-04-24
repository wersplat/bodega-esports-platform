from functools import wraps
from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.database import get_db
from sqlalchemy.orm import Session

from app.models.models import Profile


# Replace with your actual secret key and algorithm
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

router = APIRouter()


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = db.query(Profile).filter(Profile.id == user_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def admin_required(get_current_user):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            user = await get_current_user()
            if not user.is_admin:  # Assuming `is_admin` is a property of the user model
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized",
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator


@router.get("/me")
def read_current_user(current_user: Profile = Depends(get_current_user)):
    return current_user
