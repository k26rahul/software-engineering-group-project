from fastapi import APIRouter

auth_router = APIRouter(tags=["Authentication"])

# Routes to implement:
#
# POST  /auth/login
#   Description: Authenticates a user and returns a JWT token.
#   Request:  LoginRequest
#   Response: TokenResponse
#
# POST  /auth/register
#   Description: Registers a new member and sets their registration status to pending.
#   Request:  RegisterRequest
#   Response: UserProfileResponse
#
# POST  /auth/logout
#   Description: Invalidates the current user's JWT token by adding it to a blocklist.
#   Request:  LogoutRequest
#
# POST  /auth/change-password
#   Description: Changes the authenticated user's password.
#   Request:  ChangePasswordRequest
#
# GET  /auth/me
#   Description: Returns the profile of the currently authenticated user based on the JWT token.
#   Response: UserProfileResponse
