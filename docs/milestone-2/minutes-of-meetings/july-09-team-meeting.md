# Team Meeting – Milestone 2

**Date & Time:** 09 July 2026, 09:00 PM – 10:00 PM

## Attendees

- Rahul Maurya ([23f1002653@ds.study.iitm.ac.in](mailto:23f1002653@ds.study.iitm.ac.in))
- Vidhatri H R ([23f2000575@ds.study.iitm.ac.in](mailto:23f2000575@ds.study.iitm.ac.in))
- Harikesh Shukla ([23f1002264@ds.study.iitm.ac.in](mailto:23f1002264@ds.study.iitm.ac.in))
- Bharat Choudhary ([23f1000879@ds.study.iitm.ac.in](mailto:23f1000879@ds.study.iitm.ac.in))
- Taniya Gupta ([22f3000586@ds.study.iitm.ac.in](mailto:22f3000586@ds.study.iitm.ac.in))

## Agenda

- Database Schema Design.
- Inter-Component Communication and API Data Flow.

## Discussion Summary

- Harikesh and Bharat presented the proposed database schema (1.4), explaining the SQLModel classes for `User`, `Book`, and `Transaction`.
- Rahul initiated a discussion on the inter-component flow (1.5), specifically mapping out how the frontend will communicate with the backend during the book issue and return cycles.
- Taniya explained how the Zustand store will update locally upon successful transaction responses to keep the UI responsive.
- Vidhatri brought up the importance of error handling, ensuring that the frontend correctly displays validation errors thrown by FastAPI/Pydantic.
- The team agreed that the database schema will use SQLite to keep the initial setup lightweight and manageable.

## Decisions Taken

- Finalized the core Database Models (`User`, `Book`, `Transaction`) and their relationships.
- Approved the Inter-Component flow for the circulation process, including optimistic UI updates and error handling.

## Action Items

| Task | Owner | Deadline |
| --- | --- | --- |
| Document the Database Components (1.4) | Harikesh | 10 July 2026 |
| Document the Inter-Component Flow (1.5) | Rahul | 10 July 2026 |
