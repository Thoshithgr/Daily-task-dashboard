import os
from supabase import create_client, Client
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class SupabaseClient:
    def __init__(self):
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_ANON_KEY")
        
        if not supabase_url or not supabase_key:
            self.client = None
            print("Warning: Supabase credentials not configured")
        else:
            self.client = create_client(supabase_url, supabase_key)
    
    def get_client(self) -> Optional[Client]:
        """Get the Supabase client instance"""
        return self.client
    
    async def create_user(self, email: str, password: str, name: str) -> dict:
        """Create a new user"""
        if not self.client:
            raise Exception("Supabase client not configured")
        
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
        if not self.client:
            raise Exception("Supabase client not configured")
        
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
        if not self.client:
            raise Exception("Supabase client not configured")
        
        try:
            # Set the session
            self.client.auth.set_session(access_token, "")
            user = self.client.auth.get_user()
            return {"user": user}
        except Exception as e:
            return {"error": str(e)}

# Global instance
supabase_client = SupabaseClient()

