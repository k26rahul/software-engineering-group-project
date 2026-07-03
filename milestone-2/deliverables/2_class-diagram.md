# Class Diagram

## What Is This Document?

This document explains what the class diagram for the Library Management System will contain and how to read it. The actual Mermaid `classDiagram` code will be generated from this specification along with the detailed definitions in [1.3_Backend Components](1.3_backend-components.md) and [1.4_Database Components](1.4_database-components.md).

### UML Diagram Types (Reference)

| UML Diagram Type | What it shows | When to use |
|---|---|---|
| **Class Diagram** | Classes with attributes, methods, relationships | Data models, ORM entities, backend services |
| **Component Diagram** | High-level software components and their dependencies | System architecture overview |
| **Sequence Diagram** | Step-by-step message flow between actors/components | Specific workflows like "issue a book" |
| **ER Diagram** | Database tables, columns, relationships | Database design |

---

## What the Class Diagram Shows

A UML class diagram visualizes the system's classes, their internal structure (attributes and methods), and the relationships between them. For our system, the class diagram covers three categories of classes:

### 1. Data Model Classes

These are the ORM entities that map to database tables. Each class shows its attributes (with types and constraints) and any computed property methods. Defined in full in [1.4_Database Components](1.4_database-components.md).

Examples: `User`, `Book`, `BookCopy`, `Transaction`, `Fine`, `Reservation`, `Review`, `Payment`, `Notification`, `Magazine`.

### 2. Service Classes

These encapsulate business logic. Each class shows its methods (with parameters and return types). Services contain no persistent state - they receive dependencies and operate on data model classes. Defined in full in [1.3_Backend Components](1.3_backend-components.md).

Examples: `AuthService`, `MemberService`, `CatalogService`, `CirculationService`, `ReservationService`, `PaymentService`, `NotificationService`.

### 3. Enumerations

These are `enum` types used as attribute types across data models. Each enum lists its possible values. Defined in full in [1.4_Database Components](1.4_database-components.md).

Examples: `UserRole`, `MembershipType`, `CopyStatus`, `ReturnCondition`, `MemberApprovalStatus`, `ReviewStatus`.

---

## Relationship Types

The class diagram uses four types of connections:

| Arrow Type | UML Term | Meaning | Example |
|---|---|---|---|
| Solid line with filled diamond | **Composition** | "Owns and cannot exist without" | Book ◆── BookCopy (copies don't exist without a book) |
| Solid line | **Association** | "References / links to" | Transaction ── User (a transaction references a member) |
| Dashed line | **Dependency** | "Uses / calls" | CirculationService ╌╌ CatalogService |
| Hollow triangle arrow | **Realization** | "Enum used as type" | User ──▷ UserRole |

### Where Relationships Are Defined

- **Model-to-model** relationships (compositions and associations with cardinality) are defined in [1.4_Database Components](1.4_database-components.md).
- **Service-to-service** dependencies (which service calls which) are defined in [1.3_Backend Components](1.3_backend-components.md).
- **Service-to-model** dependencies (which service operates on which models) are defined in [1.3_Backend Components](1.3_backend-components.md).
- **Enum realizations** (which model uses which enum as an attribute type) are implicit from the attribute type definitions in [1.4_Database Components](1.4_database-components.md).

---

## How to Read the Diagram

1. **Data models** appear as class boxes with attributes in the top section and methods in the bottom section. Attributes show their type and constraints (PK, FK, nullable, unique).
2. **Services** appear as class boxes with only methods listed (they have no persistent attributes).
3. **Enumerations** appear as class boxes stereotyped with `<<enumeration>>`, listing their possible values.
4. **Solid lines between models** show data relationships - read the cardinality labels (1, *, 0..1) to understand how many instances relate.
5. **Dashed lines between services** show runtime dependencies - which service calls into another.
6. **Dashed lines from services to models** show which data a service reads and writes.
