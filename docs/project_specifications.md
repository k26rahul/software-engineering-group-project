# Software Engineering Project Specification Document

## 1. Project Overview

This document serves as the comprehensive technical and structural specification for the 8-week software engineering team project. It outlines the overall objectives, core requirements, team methodologies, and strict milestone deliverables. 

**Objective:** To design, develop, and deploy a full-stack, workflow-management web platform utilizing Agile methodologies. The project simulates a corporate software engineering environment, emphasizing communication, iterative planning, strict version control, code quality, and solving genuine user pain points.

### 1.1 Team Roles & Responsibilities
The project mandates a cross-functional team structure (5 members), with specific roles assigned to ensure equitable workload and professional simulation:
* **Product Manager:** Leads user research, defines pain points, writes SMART user stories, and ensures the product solves the identified problem.
* **Code Reviewer:** Enforces coding standards, reviews pull/merge requests, ensures comprehensive test coverage, and maintains technical excellence.
* **Backend Developer:** Architects the RESTful APIs, manages the database operations, and implements core business logic.
* **Frontend Developer:** Builds the responsive user interface, manages state, and integrates APIs.
* **Scrum Master / QA / Tester:** Facilitates agile processes (sprints, standups), manages the Jira/Kanban board, and writes end-to-end testing scripts.

*(Note: Members are encouraged to experience multiple roles throughout the project lifecycle.)*

### 1.2 Technology Stack
* **Frontend:** Vue.js / React.js (with Tailwind CSS or MUI)
* **Backend:** Flask / FastAPI (or equivalent web framework)
* **Database:** SQLite or PostgreSQL
* **Authentication:** Session cookie-based authentication
* **Version Control & CI/CD:** Git, GitHub/GitLab, Automated testing workflows

---

## 2. Core Functional & Technical Requirements

Regardless of the specific problem domain chosen, the final platform must strictly adhere to the following architectural requirements:

### 2.1 Functional Requirements
1.  **Multiple User Roles:** The system must support at least two distinct user roles (e.g., Primary End-User and Secondary Administrator/Manager), each with specific permissions, access levels, and dashboards.
2.  **Interrelated Workflows:** The system must facilitate complex, interconnected workflows. (e.g., A resource must be instantiated before it can be requested; a user must be authenticated and authorized to interact with a specific resource)
3.  **Data-Driven Completeness:** The platform must move beyond static pages, providing real-time state changes, data persistence, and interactive data flow.

### 2.2 Technical Requirements
1.  **API Architecture:** The backend must expose well-defined, robust, and Swagger-compatible REST APIs for all core functionalities.
2.  **Security & Authentication:** Implementation of secure session cookie-based authentication. Token overhead is to be avoided, but session management must strictly handle role-based access control (RBAC).
3.  **Automated Testing:** Comprehensive automated testing suite (e.g., Pytest). Critical business logic and API endpoints must have both happy-path and sad-path test coverage.
4.  **Agile & Version Control:** Strict adherence to Git flow. No direct commits to the `main` branch. All work must be done in feature branches and merged only after pull requests and formal code reviews.

---

## 3. Project Roadmap & Deliverables

The 8-week development cycle is broken into 5 milestones. Milestones 1 and 2 cover planning and design. Milestones 3 and 4 are active development sprints. Milestone 5 is the final submission, which also includes the culmination report and issue tracking evidence compiled throughout the project.

### 3.1 Milestone 1: User Identification & User Stories
**Objective:** Identify the application's users and write SMART (Specific, Measurable, Achievable, Relevant, Time-boxed) user stories.

> **Evaluation Note:** Grade partly depends on how many user stories are committed to versus how many are delivered.

**Team Responsibilities:**
| Role | Responsibility |
|---|---|
| Project Manager | Lead discussions and drive consensus on feature requirements and user identification |
| Scrum Master | Document Minutes of Meeting (MoM) and track discussion progress |
| Frontend Developer | Evaluate feasibility of frontend implementation |
| Backend Developer | Evaluate feasibility of backend implementation |

**Key Deliverables:**
1. **Identification of Users:** Detailed profiles for Primary, Secondary, and Tertiary users.
2. **User Research:** Proof of actual user interviews and/or observation studies. Focus on identifying pain points, not suggesting features directly. Submit audio/video clips or transcripts as verification. *Do not rely on developer assumptions or written summaries alone.*
3. **User Stories (SMART format):** A comprehensive list of user stories mapped to identified pain points, strictly using: `As a [user persona], I want [action], so that [value/benefit].`

---

### 3.2 Milestone 2: Scheduling & Design
**Objective:** Build a realistic timeline and sprint plan, complete the frontend UI, and produce backend design artifacts.

**Team Responsibilities:**
| Role | Responsibility |
|---|---|
| Project Manager (Scheduling Lead) | Plan project timeline and scrum cadences |
| Scrum Master (Scheduling Co-Lead) | Support scheduling and tracking |
| Backend Developer (Design Lead) | Develop class diagrams and component layout |
| Frontend Developer | Complete most UI pages; ensure pages are linked |
| Code Reviewer | Review structure and adherence to design practices before merging to main |

**Process Notes:**
- The Project Manager and Scrum Master must discuss the schedule with the whole team before finalizing it.
- Every frontend developer works on their own branch and opens a merge request for the Code Reviewer.
- Any issues noticed by a Code Reviewer or any team member must be tracked via GitHub Issues. (Issue tracking will be submitted as part of the final Milestone 5 report.)

**Key Deliverables** *(consolidated into a single Milestone 2 PDF Report):*
1. **Design of Components:** Visual breakdown of frontend and backend components.
2. **Class Diagram:** UML class diagram reflecting the system's architecture.
3. **Database Design Diagram:** Entity-Relationship (ER) diagram detailing tables, relationships (1:1, 1:N, N:M), foreign keys, and constraints.
4. **Sprint Schedule:** Planned sprint timeline for the entire project.
5. **Scrum Meetings Schedule & Minutes:** Meeting cadence plan and recorded MoM from held meetings.
6. **Gantt Chart Screenshot:** Screenshot of the project Gantt chart.
7. **Kanban Board Screenshot:** Screenshot of the Jira/Trello Kanban board.
8. **Frontend Page Screenshots:** Screenshots of all frontend pages developed so far.
9. **Frontend Code (ZIP):** A ZIP archive of the frontend codebase with a `README` containing installation and run instructions.

---

### 3.3 Milestone 3 (Sprint 1): API Development, Testing & User Feedback
**Objective:** Design and develop REST API endpoints, write and run test cases, integrate backend and frontend, and collect initial user feedback.

**Team Responsibilities:**
| Role | Responsibility |
|---|---|
| Product Manager (Lead) | Oversee the sprint: API creation, testing, integration, and user feedback collection |
| Backend Developer | Implement and document API endpoints |
| Scrum Master / Tester | Write unit tests for APIs |
| Frontend Developer | Integrate APIs into the frontend |
| Code Reviewer | Ensure API design consistency, code quality, and integration completeness |

> **Note:** Basic unit testing must be done by the developer immediately after writing code for each API endpoint.

**Key Deliverables:**
1. **Swagger/OpenAPI YAML:** Documentation of APIs in a Swagger-compatible YAML file.
2. **Test Cases:** Proper test cases for each API, including input, expected output, and actual output. Showcase at least one case where actual ≠ expected and explain the fix.
3. **Pytest Code:** Submit `pytest` test scripts for the implemented APIs.
4. **User Feedback & Next Sprint Plan:** Collected primary user feedback and a documented plan to implement changes in Sprint 2.

---

### 3.4 Milestone 4 (Sprint 2): Feedback Implementation & API Finalization
**Objective:** Implement changes from user feedback, finalize all API endpoints, update documentation, and ensure comprehensive test coverage.

**Key Deliverables:**
1. **Changes from User Feedback:** Documentation of changes made in response to Sprint 1 user feedback.
2. **Updated Swagger/OpenAPI YAML:** Updated API documentation reflecting all changes. The YAML must include error handling, user story mappings, and a description for each API.
3. **Backend Code:** Source code of all implemented APIs.
4. **Updated Test Cases:** Proper test cases for the updated APIs (input, expected output, actual output).
5. **Updated Pytest Code:** `pytest` scripts for the updated APIs.

---

### 3.5 Milestone 5: Final Submission & Handoff
**Objective:** Submit the final working prototype with comprehensive documentation and a polished presentation.

**Team Responsibilities:**
| Role | Responsibility |
|---|---|
| Product Manager (Lead) | Ensure all final documentation and assets are compiled for submission |

**Key Deliverables:**
1. **Video Presentation:** A recorded demo of the working project (any team member can record).
2. **Slide Presentation:** A structured presentation covering a brief project overview, with a primary focus on user stories and user identification.
3. **Complete Project Code (ZIP):** Full source code of the working project in ZIP format.
4. **README File:** A README with complete instructions to set up and run the project.
5. **Final Report:** A complete compilation of all milestones (1 through 5), including:
   - Tools and technologies used.
   - Issue tracking evidence from throughout the project.

---

## 4. Development & Collaboration Guidelines

To ensure success and compliance with grading rubrics, the team must adhere strictly to the following corporate standards:

1.  **Branching Strategy:** Use feature branches (`feature/user-story-name`, `bugfix/issue-description`).
2.  **Pull Requests:** All PRs must include a description of the changes, the related Jira/Trello ticket number, and screenshots if frontend changes were made.
3.  **Mandatory Code Reviews:** The designated Code Reviewer must approve all PRs. Code cannot be merged if tests fail or if architectural standards are compromised.
4.  **No Isolation:** Decisions regarding database schema changes or API modifications must be communicated to the entire team during daily standups or via team chat.
5.  **Issue Tracking:** All bugs and issues noticed by any team member must be logged as GitHub Issues, with status updates and owners assigned. This evidence will be submitted as part of Milestone 6.
