import sys
import os
from sqlmodel import Session, select
from core.database import engine
from models.user import User
from models.enums import UserRole
from models.notification import Notification
from models.enums import NotificationType

def main():
    with Session(engine) as session:
        # Find the LIBRARIAN user (Chitra)
        librarians = session.exec(select(User).where(User.role == UserRole.LIBRARIAN)).all()
        if not librarians:
            print("No librarian found!")
            sys.exit(1)
        
        chitra = librarians[0]
        print(f"Found librarian: {chitra.name} (ID: {chitra.id})")
        
        # Add notifications
        notif1 = Notification(
            recipient_id=chitra.id,
            type=NotificationType.REGISTRATION_APPROVED,
            message="New member registration request from Amit Patel requires your approval.",
            is_read=False
        )
        notif2 = Notification(
            recipient_id=chitra.id,
            type=NotificationType.OVERDUE_REMINDER,
            message="The book 'The Catcher in the Rye' issued to Vaishnavi is overdue by 26 days.",
            is_read=False
        )
        notif3 = Notification(
            recipient_id=chitra.id,
            type=NotificationType.BILLING_RENEWAL,
            message="Monthly billing report is ready for review.",
            is_read=False
        )
        
        session.add(notif1)
        session.add(notif2)
        session.add(notif3)
        session.commit()
        print("Successfully added 3 notifications.")

if __name__ == "__main__":
    main()
