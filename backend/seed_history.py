import random
from datetime import date, timedelta
from sqlmodel import Session, select
from core.database import engine
from models.user import User
from models.book import BookCopy
from models.transaction import Transaction
from models.enums import CopyStatus, ReturnCondition

def seed_history():
    with Session(engine) as session:
        members = session.exec(select(User).where(User.role == "MEMBER")).all()
        copies = session.exec(select(BookCopy)).all()
        
        if not members or not copies:
            print("No members or book copies found to seed.")
            return

        print(f"Found {len(members)} members and {len(copies)} copies.")
        
        for member in members:
            # Create 2 past transactions per member
            for _ in range(2):
                copy = random.choice(copies)
                
                # Pick a random date in the past 6 months
                days_ago = random.randint(30, 180)
                issue_date = date.today() - timedelta(days=days_ago)
                due_date = issue_date + timedelta(days=14)
                
                # Maybe returned on time, maybe late
                days_kept = random.randint(5, 20)
                return_date = issue_date + timedelta(days=days_kept)
                
                tx = Transaction(
                    member_id=member.id,
                    book_copy_id=copy.id,
                    issue_date=issue_date,
                    due_date=due_date,
                    return_date=return_date,
                    return_condition=ReturnCondition.GOOD
                )
                session.add(tx)
        
        session.commit()
        print("Successfully seeded borrowing history.")

if __name__ == "__main__":
    seed_history()
