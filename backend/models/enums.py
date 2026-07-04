import enum


class UserRole(str, enum.Enum):
    LIBRARIAN = "LIBRARIAN"
    MEMBER = "MEMBER"
    CAMPUS_MANAGEMENT = "CAMPUS_MANAGEMENT"


class MembershipType(str, enum.Enum):
    ON_CAMPUS = "ON_CAMPUS"
    OFF_CAMPUS = "OFF_CAMPUS"


class MemberApprovalStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class CopyStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    ISSUED = "ISSUED"
    LOST = "LOST"
    DAMAGED = "DAMAGED"


class ReturnCondition(str, enum.Enum):
    GOOD = "GOOD"
    DAMAGED = "DAMAGED"
    LOST = "LOST"


class ReservationStatus(str, enum.Enum):
    WAITING = "WAITING"
    NOTIFIED = "NOTIFIED"
    FULFILLED = "FULFILLED"
    CANCELLED = "CANCELLED"


class RequestStatus(str, enum.Enum):
    PENDING = "PENDING"
    PURCHASED = "PURCHASED"


class ReviewStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class SubscriptionFrequency(str, enum.Enum):
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    BIWEEKLY = "BIWEEKLY"
    MONTHLY = "MONTHLY"


class SubscriptionType(str, enum.Enum):
    NEWSPAPER = "NEWSPAPER"
    MAGAZINE = "MAGAZINE"


class PaymentType(str, enum.Enum):
    MEMBERSHIP_FEE = "MEMBERSHIP_FEE"
    FINE_PAYMENT = "FINE_PAYMENT"


class NotificationType(str, enum.Enum):
    OVERDUE_REMINDER = "OVERDUE_REMINDER"
    RESERVATION_AVAILABLE = "RESERVATION_AVAILABLE"
    REGISTRATION_APPROVED = "REGISTRATION_APPROVED"
    REGISTRATION_REJECTED = "REGISTRATION_REJECTED"
    BILLING_RENEWAL = "BILLING_RENEWAL"
