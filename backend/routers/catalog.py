from fastapi import APIRouter

catalog_router = APIRouter(tags=["Catalog"])

# Routes to implement:
#
# GET  /books
#   Description: Retrieves a list of all books in the catalog,
#   optionally filtered by search queries.
#   Response: list[BookSummaryResponse]
#
# POST  /books
#   Description: Adds a new book to the library catalog.
#   Request:  AddBookRequest
#   Response: BookDetailResponse
#
# PATCH  /books/{id}
#   Description: Updates metadata for an existing book.
#   Request:  UpdateBookRequest
#   Response: BookDetailResponse
#
# GET  /books/{id}
#   Description: Retrieves detailed information about a specific book, including availability.
#   Response: BookDetailResponse
#
# POST  /books/isbn-lookup
#   Description: Fetches book metadata from an external ISBN database to auto-fill details.
#   Request:  ISBNLookupRequest
#   Response: AddBookRequest
#
# PATCH  /books/{id}/copies/{copy_id}
#   Description: Updates the status of a specific physical copy of a book.
#   Request:  UpdateCopyStatusRequest
