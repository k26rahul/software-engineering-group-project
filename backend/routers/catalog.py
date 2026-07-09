"""Router: Catalog.

Endpoints are not yet implemented. See docs/milestone-2/deliverables/1.3_backend-components.md
for the full specification. Each route below is a placeholder — implement one at a time.
"""

from fastapi import APIRouter

catalog_router = APIRouter(tags=["Catalog"])

# Routes to implement:
#
# GET  /books
#   Description: Retrieves a list of all books in the catalog,
#   optionally filtered by search queries.
#
# POST  /books
#   Description: Adds a new book to the library catalog.
#
# PATCH  /books/{id}
#   Description: Updates metadata for an existing book.
#
# GET  /books/{id}
#   Description: Retrieves detailed information about a specific book, including availability.
#
# POST  /books/isbn-lookup
#   Description: Fetches book metadata from an external ISBN database to auto-fill details.
#
# PATCH  /books/{id}/copies/{copy_id}
#   Description: Updates the status of a specific physical copy of a book.
