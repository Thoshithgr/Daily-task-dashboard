from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from backend.utils.supabase_client import supabase_client

router = APIRouter()

class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class UserResponse(BaseModel):
    user_id: str
    email: str
    name: str
    access_token: str

@router.post("/login")
async def login(credentials: UserLogin):
    """Login user with Supabase"""
    try:
        result = await supabase_client.login(credentials.email, credentials.password)
        
        if "error" in result:
            raise HTTPException(status_code=401, detail=result["error"])
        
        user = result.get("user")
        session = result.get("session")
        
        if not user or not session:
            raise HTTPException(status_code=401, detail="Authentication failed")
        
        # Get user profile
        client = supabase_client.get_client()
        if client:
            profile = client.table("profiles").select("*").eq("id", user.id).execute()
            name = profile.data[0]["name"] if profile.data else user.email
        else:
            name = user.email
        
        return {
            "user_id": user.id,
            "email": user.email,
            "name": name,
            "access_token": session.access_token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/register")
async def register(user: UserRegister):
    """Register new user with Supabase"""
    try:
        result = await supabase_client.create_user(user.email, user.password, user.name)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        auth_data = result.get("user")
        session = result.get("session")
        
        if not auth_data or not session:
            raise HTTPException(status_code=400, detail="Registration failed")
        
        return {
            "user_id": auth_data.id,
            "email": auth_data.email,
            "name": user.name,
            "access_token": session.access_token,
            "token_type": "bearer",
            "message": "User registered successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/logout")
async def logout(access_token: str):
    """Logout user"""
    try:
        client = supabase_client.get_client()
        if client:
            client.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me")
async def get_current_user(access_token: str):
    """Get current user info"""
    try:
        result = await supabase_client.get_user(access_token)
        
        if "error" in result:
            raise HTTPException(status_code=401, detail=result["error"])
        
        return result.get("user")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
