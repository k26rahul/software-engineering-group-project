import enum


class UserRole(str, enum.Enum):
  """Roles assigned to users in the system."""

  LIBRARIAN = "LIBRARIAN"
  MEMBER = "MEMBER"
  CAMPUS_MANAGEMENT = "CAMPUS_MANAGEMENT"


class MembershipType(str, enum.Enum):
  """Membership categories based on campus residency."""

  ON_CAMPUS = "ON_CAMPUS"
  OFF_CAMPUS = "OFF_CAMPUS"


class MemberApprovalStatus(str, enum.Enum):
  """Approval lifecycle states for member registration."""

  PENDING = "PENDING"
  APPROVED = "APPROVED"
  REJECTED = "REJECTED"


class CopyStatus(str, enum.Enum):
  """Physical availability states of a book copy."""

  AVAILABLE = "AVAILABLE"
  ISSUED = "ISSUED"
  LOST = "LOST"
  DAMAGED = "DAMAGED"


class ReturnCondition(str, enum.Enum):
  """Condition of a book copy at the time of return."""

  GOOD = "GOOD"
  DAMAGED = "DAMAGED"
  LOST = "LOST"


class ReservationStatus(str, enum.Enum):
  """Lifecycle states of a book reservation request."""

  WAITING = "WAITING"
  NOTIFIED = "NOTIFIED"
  FULFILLED = "FULFILLED"
  CANCELLED = "CANCELLED"


class RequestStatus(str, enum.Enum):
  """Processing states for a book purchase request."""

  PENDING = "PENDING"
  PURCHASED = "PURCHASED"


class ReviewStatus(str, enum.Enum):
  """Moderation states for a member-submitted review."""

  PENDING = "PENDING"
  APPROVED = "APPROVED"
  REJECTED = "REJECTED"


class SubscriptionFrequency(str, enum.Enum):
  """Delivery frequency options for a periodical subscription."""

  DAILY = "DAILY"
  WEEKLY = "WEEKLY"
  BIWEEKLY = "BIWEEKLY"
  MONTHLY = "MONTHLY"


class SubscriptionType(str, enum.Enum):
  """Categories of periodical subscriptions."""

  NEWSPAPER = "NEWSPAPER"
  MAGAZINE = "MAGAZINE"


class PaymentType(str, enum.Enum):
  """Types of payments processed in the system."""

  MEMBERSHIP_FEE = "MEMBERSHIP_FEE"
  FINE_PAYMENT = "FINE_PAYMENT"


class NotificationType(str, enum.Enum):
  """Event-driven notification categories sent to users."""

  OVERDUE_REMINDER = "OVERDUE_REMINDER"
  RESERVATION_AVAILABLE = "RESERVATION_AVAILABLE"
  REGISTRATION_APPROVED = "REGISTRATION_APPROVED"
  REGISTRATION_REJECTED = "REGISTRATION_REJECTED"
  BILLING_RENEWAL = "BILLING_RENEWAL"
