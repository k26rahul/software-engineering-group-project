from fastapi import APIRouter

reading_lists_router = APIRouter(tags=["Reading Lists"])

# Routes to implement:
#
# GET  /reading-lists
#   Description: Retrieves a list of all reading lists.
#   Response: list[ReadingListResponse]
#
# GET  /reading-lists/{id}
#   Description: Retrieves the details and associated books for a specific reading list.
#   Response: ReadingListResponse
#
# POST  /reading-lists
#   Description: Creates a new reading list.
#   Request:  CreateReadingListRequest
#   Response: ReadingListResponse
#
# PATCH  /reading-lists/{id}
#   Description: Updates an existing reading list or adds/removes books from it.
#   Request:  UpdateReadingListRequest
#   Response: ReadingListResponse
#
# DELETE  /reading-lists/{id}
#   Description: Deletes a specific reading list.
