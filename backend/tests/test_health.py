def test_health_check(client):
  """Verifies the health check endpoint returns a 200 OK status and correct version."""
  response = client.get("/health")
  assert response.status_code == 200
  body = response.json()
  assert body["status"] == "ok"
  assert body["version"] == "0.1.0"
