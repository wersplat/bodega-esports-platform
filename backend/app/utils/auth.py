from functools import wraps
from fastapi import Depends, HTTPException, status, APIRouter, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.database import get_db, supabase_client
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
# Removed unused import
from app.models.models import Profile

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

router = APIRouter(prefix="/auth", tags=["Auth"])

# AUTH HELPERS

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
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
        stmt = select(Profile).where(Profile.id == user_id)
        result = await db.execute(stmt)
        user = result.scalars().first()
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
            if not user.is_admin:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized",
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator


# ROUTES

@router.post("/signup")
async def signup(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required.")

    result = supabase_client.auth.sign_up({"email": email, "password": password})

    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])

    return {"message": "Signup successful. Check your email to verify your account."}


@router.post("/login")
async def login(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required.")

    result = supabase_client.auth.sign_in_with_password({"email": email, "password": password})

    if result.get("error"):
        raise HTTPException(status_code=401, detail=result["error"]["message"])

    return {
        "access_token": result["session"]["access_token"],
        "refresh_token": result["session"]["refresh_token"],
        "user": result["user"]
    }


@router.post("/password-reset")
async def password_reset(request: Request):
    data = await request.json()
    email = data.get("email")

    if not email:
        raise HTTPException(status_code=400, detail="Email is required.")

    result = supabase_client.auth.reset_password_email(email)

    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])

    return {"message": "Password reset email sent."}


@router.get("/me")
def read_current_user(current_user: Profile = Depends(get_current_user)):
    return current_user