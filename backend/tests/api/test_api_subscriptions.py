from fastapi.testclient import TestClient


def test_subscriptions(client: TestClient, normal_user_token: str, librarian_user_token: str):
  member_headers = {"Authorization": f"Bearer {normal_user_token}"}
  librarian_headers = {"Authorization": f"Bearer {librarian_user_token}"}

  # 1. Member cannot create
  resp = client.post(
    "/subscriptions",
    json={"type": "NEWSPAPER", "copies": 2, "price_per_copy": 1.5, "frequency": "DAILY"},
    headers=member_headers,
  )
  assert resp.status_code == 403

  # 2. Librarian creates
  payload = {"type": "NEWSPAPER", "copies": 2, "price_per_copy": 1.5, "frequency": "DAILY"}
  resp = client.post("/subscriptions", json=payload, headers=librarian_headers)
  assert resp.status_code == 200
  sub_id = resp.json()["id"]

  # 3. List subscriptions
  resp = client.get("/subscriptions")
  assert resp.status_code == 200
  subs = resp.json()
  assert len(subs) > 0
  assert any(s["id"] == sub_id for s in subs)

  # 4. Update subscription
  resp = client.patch(f"/subscriptions/{sub_id}", json={"copies": 5}, headers=librarian_headers)
  assert resp.status_code == 200
  assert resp.json()["copies"] == 5

  # 5. Cancel subscription
  resp = client.delete(f"/subscriptions/{sub_id}", headers=librarian_headers)
  assert resp.status_code == 204

  # 6. List subscriptions (it should have is_active=False)
  resp = client.get("/subscriptions")
  assert resp.status_code == 200
  sub = next(s for s in resp.json() if s["id"] == sub_id)
  assert sub["is_active"] is False
