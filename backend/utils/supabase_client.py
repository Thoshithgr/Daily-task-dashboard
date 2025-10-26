import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# Try to import supabase only if available
try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False
    Client = None

class SupabaseClient:
    def __init__(self):
        supabase_url = os.getenv("SUPABASE_URL", "")
        supabase_key = os.getenv("SUPABASE_ANON_KEY", "")
        
        self.enabled = False
        
        if not supabase_url or not supabase_key:
            self.client = None
            self.enabled = False
        elif not SUPABASE_AVAILABLE:
            self.client = None
            self.enabled = False
            print("Warning: supabase package not installed")
        else:
            try:
                self.client = create_client(supabase_url, supabase_key)
                self.enabled = True
            except Exception as e:
                print(f"Warning: Failed to initialize Supabase client: {e}")
                self.client = None
                self.enabled = False
    
    def get_client(self) -> Optional[Client]:
        """Get the Supabase client instance"""
        return self.client
    
    async def create_user(self, email: str, password: str, name: str) -> dict:
        """Create a new user"""
        if not self.enabled or not self.client:
            # Return mock response when Supabase not configured
            return {
                "user": {"id": "mock-user-123", "email": email},
                "session": {"access_token": "mock-token", "token_type": "bearer"}
            }
        
        try:
            # Create auth user
            response = self.client.auth.sign_up({
                "email": email,
                "password": password
            })
            
            if response.user:
                # Store additional user info in a custom table
                user_data = {
                    "id": response.user.id,
                    "email": email,
                    "name": name,
                    "created_at": "now()"
                }
                
                # Insert into profiles table
                self.client.table("profiles").insert(user_data).execute()
                
                return {
                    "user": response.user,
                    "session": response.session
                }
            return {"error": "Failed to create user"}
        except Exception as e:
            return {"error": str(e)}
    
    async def login(self, email: str, password: str) -> dict:
        """Authenticate user"""
        if not self.enabled or not self.client:
            # Return mock response when Supabase not configured
            return {
                "user": {"id": "mock-user-123", "email": email},
                "session": {"access_token": "mock-token", "token_type": "bearer"}
            }
        
        try:
            response = self.client.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            return {
                "user": response.user,
                "session": response.session
            }
        except Exception as e:
            return {"error": str(e)}
    
    async def get_user(self, access_token: str) -> dict:
        """Get user from access token"""
        if not self.enabled or not self.client:
            # Return mock user when Supabase not configured
            return {"user": {"id": "mock-user-123", "email": "user@example.com"}}
        
        try:
            # Set the session
            self.client.auth.set_session(access_token, "")
            user = self.client.auth.get_user()
            return {"user": user}
        except Exception as e:
            return {"error": str(e)}

# Global instance
supabase_client = SupabaseClient()

