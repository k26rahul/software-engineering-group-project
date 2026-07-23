# Team Meeting – Milestone 2

**Date & Time:** 06 July 2026, 09:00 PM – 10:00 PM

## Attendees

- Rahul Maurya ([23f1002653@ds.study.iitm.ac.in](mailto:23f1002653@ds.study.iitm.ac.in))
- Vidhatri H R ([23f2000575@ds.study.iitm.ac.in](mailto:23f2000575@ds.study.iitm.ac.in))
- Harikesh Shukla ([23f1002264@ds.study.iitm.ac.in](mailto:23f1002264@ds.study.iitm.ac.in))
- Bharat Choudhary ([23f1000879@ds.study.iitm.ac.in](mailto:23f1000879@ds.study.iitm.ac.in))
- Taniya Gupta ([22f3000586@ds.study.iitm.ac.in](mailto:22f3000586@ds.study.iitm.ac.in))

## Agenda

- Reviewing the high-level architecture and component design.
- Strategy for unblocking frontend development.

## Discussion Summary

- The team reviewed the overall system architecture (1.1 Design of Components).
- Taniya led the discussion on separating the frontend components from backend services to ensure a clean decoupled architecture.
- Harikesh discussed the routing structure on the backend, advocating for a layered architecture (Routers → Services → Models).
- Vidhatri emphasized the need for Mock Service Worker (MSW) so the frontend team can develop independently while the backend API is built.
- Rahul outlined the major modules required: Authentication, Catalog, and Circulation.

## Decisions Taken

- Approved the Layered Architecture for the backend to keep business logic isolated in services.
- Decided to implement Mock Service Worker (MSW) on the frontend to mock API responses during early development.

## Action Items

| Task | Owner | Deadline |
| --- | --- | --- |
| Draft the detailed frontend component list | Taniya & Vidhatri | 07 July 2026 |
| Draft the backend routers and services structure | Harikesh & Bharat | 07 July 2026 |
