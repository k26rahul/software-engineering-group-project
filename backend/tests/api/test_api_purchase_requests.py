"""Tests for Purchase Requests API endpoints."""

from fastapi.testclient import TestClient

def test_create_and_list_purchase_requests(client: TestClient, normal_user_token: str):
    headers = {"Authorization": f"Bearer {normal_user_token}"}
    
    # List should be empty initially
    resp = client.get("/purchase-requests")
    assert resp.status_code == 200
    
    # Create request
    payload = {
        "title": "Introduction to Algorithms",
        "author": "Thomas H. Cormen",
        "description": "A classic algorithm textbook."
    }
    resp = client.post("/purchase-requests", json=payload, headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "Introduction to Algorithms"
    assert data["upvote_count"] == 0
    assert data["status"] == "PENDING"
    
    request_id = data["id"]
    
    # List should now have 1 item
    resp = client.get("/purchase-requests")
    assert resp.status_code == 200
    list_data = resp.json()
    assert len(list_data) >= 1
    assert any(r["id"] == request_id for r in list_data)

def test_upvote_purchase_request(client: TestClient, normal_user_token: str):
    headers = {"Authorization": f"Bearer {normal_user_token}"}
    
    # Create request
    payload = {
        "title": "Clean Code",
        "author": "Robert C. Martin"
    }
    resp = client.post("/purchase-requests", json=payload, headers=headers)
    assert resp.status_code == 200
    request_id = resp.json()["id"]
    
    # Upvote request
    resp = client.post(f"/purchase-requests/{request_id}/upvote", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["upvote_count"] == 1
    
    # Upvote again should fail
    resp = client.post(f"/purchase-requests/{request_id}/upvote", headers=headers)
    assert resp.status_code == 400
    assert "already upvoted" in resp.json()["detail"]

def test_mark_purchase_request_purchased_as_member(client: TestClient, normal_user_token: str):
    headers = {"Authorization": f"Bearer {normal_user_token}"}
    
    # Create request
    payload = {
        "title": "Member Book",
        "author": "John Doe"
    }
    resp = client.post("/purchase-requests", json=payload, headers=headers)
    request_id = resp.json()["id"]
    
    # Try to mark purchased as member
    resp = client.patch(f"/purchase-requests/{request_id}/status", headers=headers)
    assert resp.status_code == 403

def test_mark_purchase_request_purchased_as_librarian(client: TestClient, normal_user_token: str, librarian_user_token: str):
    member_headers = {"Authorization": f"Bearer {normal_user_token}"}
    librarian_headers = {"Authorization": f"Bearer {librarian_user_token}"}
    
    # Create request
    payload = {
        "title": "Librarian Book",
        "author": "Jane Doe"
    }
    resp = client.post("/purchase-requests", json=payload, headers=member_headers)
    request_id = resp.json()["id"]
    
    # Mark purchased as librarian
    resp = client.patch(f"/purchase-requests/{request_id}/status", headers=librarian_headers)
    assert resp.status_code == 200
    assert resp.json()["status"] == "PURCHASED"
