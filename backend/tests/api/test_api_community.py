"""Tests for Community Engagement API endpoints (Reviews & Reading Lists)."""

from fastapi.testclient import TestClient


def test_submit_and_list_reviews(client: TestClient, normal_user_token: str, librarian_user_token: str):
    member_headers = {"Authorization": f"Bearer {normal_user_token}"}
    librarian_headers = {"Authorization": f"Bearer {librarian_user_token}"}
    
    # Need a book to review. Create one as librarian.
    book = client.post(
        "/books",
        json={"title": "Test Book", "author": "Test Author", "category": "Fiction", "price": 10.0},
        headers=librarian_headers,
    ).json()
    book_id = book["id"]
    
    # Submit review
    review_payload = {"rating": 5, "text": "Great book!"}
    resp = client.post(f"/books/{book_id}/reviews", json=review_payload, headers=member_headers)
    assert resp.status_code == 200
    review_id = resp.json()["id"]
    
    # List reviews, should be empty because it's PENDING
    resp = client.get(f"/books/{book_id}/reviews")
    assert resp.status_code == 200
    assert len(resp.json()) == 0
    
    # Moderate review as librarian
    resp = client.patch(f"/reviews/{review_id}/moderate?status=APPROVED", headers=librarian_headers)
    assert resp.status_code == 200
    
    # List reviews again, should have 1 item
    resp = client.get(f"/books/{book_id}/reviews")
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_delete_review(client: TestClient, normal_user_token: str, librarian_user_token: str):
    member_headers = {"Authorization": f"Bearer {normal_user_token}"}
    librarian_headers = {"Authorization": f"Bearer {librarian_user_token}"}
    
    book = client.post(
        "/books",
        json={"title": "Test Book 2", "author": "Test Author 2", "category": "Fiction", "price": 10.0},
        headers=librarian_headers,
    ).json()
    book_id = book["id"]
    
    resp = client.post(f"/books/{book_id}/reviews", json={"rating": 4, "text": "Good"}, headers=member_headers)
    review_id = resp.json()["id"]
    
    # Delete review
    resp = client.delete(f"/books/reviews/{review_id}", headers=member_headers)
    assert resp.status_code == 204


def test_reading_lists(client: TestClient, normal_user_token: str, librarian_user_token: str):
    member_headers = {"Authorization": f"Bearer {normal_user_token}"}
    librarian_headers = {"Authorization": f"Bearer {librarian_user_token}"}
    
    # Member cannot create
    resp = client.post("/reading-lists", json={"title": "Favorites"}, headers=member_headers)
    assert resp.status_code == 403
    
    # Librarian creates
    payload = {"title": "Summer Hits", "description": "Best books"}
    resp = client.post("/reading-lists", json=payload, headers=librarian_headers)
    assert resp.status_code == 200
    list_id = resp.json()["id"]
    
    # Add a book
    book = client.post(
        "/books",
        json={"title": "Test Book 3", "author": "Test Author 3", "category": "Fiction", "price": 10.0},
        headers=librarian_headers,
    ).json()
    book_id = book["id"]
    
    resp = client.post(f"/reading-lists/{list_id}/books?book_id={book_id}", headers=librarian_headers)
    assert resp.status_code == 200
    assert book_id in resp.json()["book_ids"]
    
    # Remove book
    resp = client.delete(f"/reading-lists/{list_id}/books/{book_id}", headers=librarian_headers)
    assert resp.status_code == 204
    
    # Delete list
    resp = client.delete(f"/reading-lists/{list_id}", headers=librarian_headers)
    assert resp.status_code == 204
