"""Tests for Books Catalog API endpoints."""

from fastapi.testclient import TestClient


def test_list_books_empty(client: TestClient):
  """Verify GET /books returns empty list when catalog is empty."""
  response = client.get("/books")
  assert response.status_code == 200
  assert response.json() == []


def test_create_book_as_librarian(client: TestClient, librarian_user_token: str):
  """Verify librarian can add a book to the catalog."""
  headers = {"Authorization": f"Bearer {librarian_user_token}"}
  payload = {
    "title": "Clean Architecture",
    "author": "Robert C. Martin",
    "isbn": "978-0134494166",
    "category": "Software",
    "price": 34.99,
    "description": "Craftsman's guide to software structure",
  }
  response = client.post("/books", json=payload, headers=headers)
  assert response.status_code == 201
  data = response.json()
  assert data["title"] == "Clean Architecture"
  assert data["available_copies"] == 1

  list_resp = client.get("/books")
  assert len(list_resp.json()) == 1


def test_create_book_as_member_forbidden(client: TestClient, normal_user_token: str):
  """Verify non-librarian member receives 403 when attempting to add a book."""
  headers = {"Authorization": f"Bearer {normal_user_token}"}
  payload = {
    "title": "Unauthorized Book",
    "author": "Unknown",
    "category": "Fiction",
    "price": 10.0,
  }
  response = client.post("/books", json=payload, headers=headers)
  assert response.status_code == 403


def test_get_book_detail_and_not_found(client: TestClient, librarian_user_token: str):
  """Verify retrieving book details and 404 response for non-existent book."""
  headers = {"Authorization": f"Bearer {librarian_user_token}"}
  payload = {
    "title": "Design Patterns",
    "author": "Gang of Four",
    "category": "Software",
    "price": 45.00,
  }
  created = client.post("/books", json=payload, headers=headers).json()

  response = client.get(f"/books/{created['id']}")
  assert response.status_code == 200
  assert response.json()["title"] == "Design Patterns"

  notFound = client.get("/books/99999")
  assert notFound.status_code == 404


def test_isbn_lookup(client: TestClient):
  """Verify ISBN lookup endpoint returns expected auto-fill schema."""
  response = client.post("/books/isbn-lookup", json={"isbn": "978-1234567890"})
  assert response.status_code == 200
  data = response.json()
  assert data["isbn"] == "978-1234567890"


def test_update_book_and_copy_status(client: TestClient, librarian_user_token: str):
  """Verify librarian can update book metadata and copy status."""
  headers = {"Authorization": f"Bearer {librarian_user_token}"}
  book = client.post(
    "/books",
    json={"title": "Refactoring", "author": "Martin Fowler", "category": "Code", "price": 40.0},
    headers=headers,
  ).json()

  update_resp = client.patch(
    f"/books/{book['id']}",
    json={"title": "Refactoring 2nd Edition"},
    headers=headers,
  )
  assert update_resp.status_code == 200
  assert update_resp.json()["title"] == "Refactoring 2nd Edition"

  copy_update = client.patch(
    f"/books/{book['id']}/copies/1",
    json={"status": "MAINTENANCE"},
    headers=headers,
  )
  assert copy_update.status_code == 200
  assert copy_update.json()["available_copies"] == 0
