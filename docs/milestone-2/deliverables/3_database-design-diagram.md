# Database Design Diagram (ER Diagram)

## What Is This Document?

This document explains what the Entity-Relationship diagram for the Library Management System will contain and how to read it. The actual Mermaid `erDiagram` code will be generated from this specification along with the detailed definitions in [1.4_Database Components](1.4_database-components.md).

**View the Database Design Diagram here:** [https://mermaid.ai/d/51df6326-1c91-4859-9266-8cefe5af24a8](https://mermaid.ai/d/51df6326-1c91-4859-9266-8cefe5af24a8)

**View the Mermaid source file:** [3_database-design-diagram.mermaid](3_database-design-diagram.mermaid)

---

## What the ER Diagram Shows

An ER diagram visualizes the database schema - the tables, their columns, and how they relate to each other. Unlike the class diagram (which also includes services and enums), the ER diagram focuses exclusively on persistent data storage.

### Entities

Each data model from [1.4_Database Components](1.4_database-components.md) maps to a database entity (table) in the ER diagram. The entity shows:

- **Table name** (derived from the model class name)
- **Columns** with their data types (int, str, float, date, datetime, bool)
- **Constraints** - primary keys (PK), foreign keys (FK), unique, nullable

The full list of entities: `User`, `Book`, `BookCopy`, `Transaction`, `Fine`, `Reservation`, `PurchaseRequest`, `PurchaseRequestVote`, `Review`, `ReadingList`, `ReadingListBook`, `Subscription`, `BookPurchaseEntry`, `Payment`, `Notification`, `Magazine`.

### Relationships

Model-to-model relationships from [1.4_Database Components](1.4_database-components.md) translate directly into ER relationships. Each relationship shows:

- **Cardinality** - one-to-one (1:1), one-to-many (1:N), or many-to-many (N:M)
- **Foreign key direction** - which table holds the FK reference

For example:
- `User` 1──* `Transaction` means one user has many transactions, with `Transaction.member_id` as the FK.
- `ReadingList` *──* `Book` is a many-to-many relationship resolved through the `ReadingListBook` junction table.

### Enumerations in the ER Diagram

Enumerations can be represented either as separate entities or simply as column types within their parent entity. In the generated diagram, they are explicitly shown as separate entities for clarity. For example, the `UserRole` enumeration acts as the type for the `role` column in the `User` table, indicating it is constrained to specific values (`LIBRARIAN`, `MEMBER`, `CAMPUS_MANAGEMENT`). Both representations are perfectly valid.

---

## How to Read the Diagram

1. **Boxes** represent database tables. Column names, types, and constraints are listed inside.
2. **Lines between boxes** represent foreign key relationships. Follow the line from the FK column to the referenced table's PK.
3. **Cardinality markers** at each end of a line show how many rows participate: `||` (exactly one), `o|` (zero or one), `}|` (one or more), `}o` (zero or more).
4. **Junction tables** (like `ReadingListBook` and `PurchaseRequestVote`) resolve many-to-many relationships - they have FKs pointing to both parent tables.
