"""Router: Authentication.

Endpoints are not yet implemented. See docs/milestone-2/deliverables/1.3_backend-components.md
for the full specification. Each route below is a placeholder — implement one at a time.
"""

from fastapi import APIRouter

auth_router = APIRouter(tags=["Authentication"])

# Routes to implement:
#
# POST  /auth/login
#   Description: Authenticates a user and returns a JWT token.
#
# POST  /auth/register
#   Description: Registers a new member and sets their registration status to pending.
#
# POST  /auth/logout
#   Description: Invalidates the current user's JWT token by adding it to a blocklist.
#
# POST  /auth/change-password
#   Description: Changes the authenticated user's password.
#
# GET  /auth/me
#   Description: Returns the profile of the currently authenticated user based on the JWT token.
