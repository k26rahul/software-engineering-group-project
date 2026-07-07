"""Router: Reading Lists.

Endpoints are not yet implemented. See docs/milestone-2/deliverables/1.3_backend-components.md
for the full specification. Each route below is a placeholder — implement one at a time.
"""

from fastapi import APIRouter

reading_lists_router = APIRouter(tags=["Reading Lists"])

# Routes to implement:
#
# GET  /reading-lists
#   Description: Retrieves a list of all reading lists.
#
# GET  /reading-lists/{id}
#   Description: Retrieves the details and associated books for a specific reading list.
#
# POST  /reading-lists
#   Description: Creates a new reading list.
#
# PATCH  /reading-lists/{id}
#   Description: Updates an existing reading list or adds/removes books from it.
#
# DELETE  /reading-lists/{id}
#   Description: Deletes a specific reading list.
