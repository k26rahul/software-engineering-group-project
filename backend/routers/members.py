"""Router: Members.

Endpoints are not yet implemented. See docs/milestone-2/deliverables/1.3_backend-components.md
for the full specification. Each route below is a placeholder — implement one at a time.
"""

from fastapi import APIRouter

members_router = APIRouter(tags=["Members"])

# Routes to implement:
#
# GET  /members
#   Description: Retrieves a list of all members, optionally filtered by status or type.
#
# GET  /members/{id}
#   Description: Retrieves the profile details of a specific member.
#
# PATCH  /members/{id}/approve
#   Description: Librarian-only. Approves a pending member registration.
#
# PATCH  /members/{id}/reject
#   Description: Librarian-only. Rejects a pending member registration.
#
# PATCH  /members/{id}/profile
#   Description: Updates a specific member's profile details.
#
# GET  /members/{id}/history
#   Description: Retrieves the borrowing history for a specific member.
