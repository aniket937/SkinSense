from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_check_returns_healthy() -> None:
    response = client.get("/api/v1/health/")

    assert response.status_code == 200

    payload = response.json()

    assert payload["status"] == "healthy"
    assert payload["service"] == "SkinSense API"
    assert payload["version"]


def test_health_check_does_not_expose_secrets() -> None:
    response = client.get("/api/v1/health/")

    assert "AUTH_SECRET" not in response.text
    assert "ELEVENLABS_API_KEY" not in response.text
    assert "DATABASE_URL" not in response.text
