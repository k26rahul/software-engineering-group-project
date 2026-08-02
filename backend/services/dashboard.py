"""Service layer for Dashboard & Analytics domain."""

from datetime import date

from sqlmodel import Session, select

from models.book import Book
from models.budget import BookPurchaseEntry
from models.enums import MemberApprovalStatus
from models.subscription import Subscription
from models.transaction import Transaction
from models.user import User
from schemas.dashboard import LibrarianDashboardResponse, ManagementDashboardResponse


class DashboardService:
  """Service aggregate metrics for librarian and campus management dashboards."""

  @staticmethod
  def get_librarian_dashboard(session: Session) -> LibrarianDashboardResponse:
    """Retrieve aggregated dashboard metrics and alerts for librarians."""
    today = date.today()

    total_books = len(session.exec(select(Book)).all())

    active_issues_list = session.exec(
      select(Transaction).where(Transaction.return_date.is_(None))
    ).all()
    active_issues = len(active_issues_list)

    overdue_issues_list = [t for t in active_issues_list if t.due_date < today]
    overdue_issues = len(overdue_issues_list)

    pending_approvals = len(
      session.exec(select(User).where(User.approval_status == MemberApprovalStatus.PENDING)).all()
    )

    alerts = []
    if pending_approvals > 0:
      alerts.append(f"{pending_approvals} member registration(s) pending approval.")
    if overdue_issues > 0:
      alerts.append(f"{overdue_issues} book issuance(s) currently overdue.")

    return LibrarianDashboardResponse(
      total_books=total_books,
      active_issues=active_issues,
      overdue_issues=overdue_issues,
      pending_approvals=pending_approvals,
      recent_alerts=alerts,
    )

  @staticmethod
  def get_management_dashboard(session: Session) -> ManagementDashboardResponse:
    """Retrieve aggregated campus management analytics and financial stats."""
    total_members = len(session.exec(select(User)).all())
    total_catalog_items = len(session.exec(select(Book)).all())
    total_circulation = len(session.exec(select(Transaction)).all())
    active_subscriptions = len(session.exec(select(Subscription)).all())

    purchases = session.exec(select(BookPurchaseEntry)).all()
    total_allocated = 50000.0
    total_spent = sum(p.total_cost() for p in purchases)

    return ManagementDashboardResponse(
      total_members=total_members,
      total_catalog_items=total_catalog_items,
      total_circulation_count=total_circulation,
      active_subscriptions_count=active_subscriptions,
      total_budget_allocated=total_allocated,
      total_budget_spent=total_spent,
    )
