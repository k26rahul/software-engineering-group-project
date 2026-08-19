"""Members Management API router for member directory, profile updates, and approvals."""

from fastapi import APIRouter, Query, Response, status

from core.dependencies import CurrentUserDep, LibrarianDep, SessionDep
from models.enums import MemberApprovalStatus, UserRole
from schemas.transaction import TransactionHistoryItemResponse
from schemas.user import MemberDetailResponse, MemberSummaryResponse, UpdateProfileRequest
from services.members import MembersService

members_router = APIRouter(tags=["Members"])

# Shared response sets for common error patterns.
_AUTH_ERRORS = {401: {"description": "Invalid, expired, or revoked token."}}
_LIBRARIAN_ERRORS = {
  **_AUTH_ERRORS,
  403: {"description": "Insufficient permissions. Librarian role required."},
}
_NOT_FOUND = {404: {"description": "Member not found."}}


@members_router.get(
  "/members",
  response_model=list[MemberSummaryResponse],
  summary="List all members",
  description="Librarian-only. Retrieves a list of members filtered by approval status or role.",
  responses={**_LIBRARIAN_ERRORS},
)
def list_members(
  session: SessionDep,
  _: LibrarianDep,
  approval_status: MemberApprovalStatus | None = Query(
    default=None, description="Filter by member approval status"
  ),
  role: UserRole | None = Query(default=None, description="Filter by user role"),
  search: str | None = Query(default=None, description="Search by name or email"),
) -> list[MemberSummaryResponse]:
  return MembersService.list_members(
    session, approval_status=approval_status, role=role, search=search
  )


@members_router.get(
  "/members/{id}",
  response_model=MemberDetailResponse,
  summary="Get member details",
  description="Retrieves the profile details of a specific member.",
  responses={
    **_AUTH_ERRORS,
    **_NOT_FOUND,
  },
)
def get_member(
  id: int,
  session: SessionDep,
  _: CurrentUserDep,
) -> MemberDetailResponse:
  return MembersService.get_member(session, id)


@members_router.patch(
  "/members/{id}/approve",
  status_code=status.HTTP_204_NO_CONTENT,
  summary="Approve member registration",
  description="Librarian-only. Approves a pending member registration and activates their account.",
  responses={
    **_LIBRARIAN_ERRORS,
    **_NOT_FOUND,
  },
)
def approve_member(
  id: int,
  session: SessionDep,
  _: LibrarianDep,
):
  MembersService.approve_member(session, id)
  return Response(status_code=status.HTTP_204_NO_CONTENT)


@members_router.patch(
  "/members/{id}/reject",
  status_code=status.HTTP_204_NO_CONTENT,
  summary="Reject member registration",
  description="Librarian-only. Rejects a pending member registration.",
  responses={
    **_LIBRARIAN_ERRORS,
    **_NOT_FOUND,
  },
)
def reject_member(
  id: int,
  session: SessionDep,
  _: LibrarianDep,
):
  MembersService.reject_member(session, id)
  return Response(status_code=status.HTTP_204_NO_CONTENT)


@members_router.patch(
  "/members/{id}/profile",
  response_model=MemberDetailResponse,
  summary="Update member profile",
  description="Updates a specific member's profile details.",
  responses={
    **_AUTH_ERRORS,
    **_NOT_FOUND,
  },
)
def update_profile(
  id: int,
  request: UpdateProfileRequest,
  session: SessionDep,
  _: CurrentUserDep,
) -> MemberDetailResponse:
  return MembersService.update_profile(session, id, request)


@members_router.get(
  "/members/{id}/history",
  response_model=list[TransactionHistoryItemResponse],
  summary="Get member borrowing history",
  description="Retrieves the borrowing history for a specific member.",
  responses={
    **_AUTH_ERRORS,
    **_NOT_FOUND,
  },
)
def get_member_history(
  id: int,
  session: SessionDep,
  _: CurrentUserDep,
) -> list[TransactionHistoryItemResponse]:
  return MembersService.get_member_history(session, id)
