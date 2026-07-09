from fastapi import APIRouter

members_router = APIRouter(tags=["Members"])

# Routes to implement:
#
# GET  /members
#   Description: Retrieves a list of all members, optionally filtered by status or type.
#   Response: list[MemberSummaryResponse]
#
# GET  /members/{id}
#   Description: Retrieves the profile details of a specific member.
#   Response: MemberDetailResponse
#
# PATCH  /members/{id}/approve
#   Description: Librarian-only. Approves a pending member registration.
#   Response: MemberDetailResponse
#
# PATCH  /members/{id}/reject
#   Description: Librarian-only. Rejects a pending member registration.
#   Response: MemberDetailResponse
#
# PATCH  /members/{id}/profile
#   Description: Updates a specific member's profile details.
#   Request:  UpdateProfileRequest
#   Response: MemberDetailResponse
#
# GET  /members/{id}/history
#   Description: Retrieves the borrowing history for a specific member.
#   Response: list[BorrowingHistoryItemResponse]
