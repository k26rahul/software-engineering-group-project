from datetime import datetime, timedelta, timezone

import pytest
from jose import JWTError, jwt

from core.auth import (
  create_access_token,
  decode_token,
  hash_password,
  verify_password,
)
from core.config import settings


def test_hash_and_verify_password():
  """Verifies that passwords can be hashed and verified correctly."""
  password = "supersecretpassword"
  hashed = hash_password(password)

  assert hashed != password
  assert verify_password(password, hashed) is True
  assert verify_password("wrongpassword", hashed) is False


def test_create_access_token():
  """Verifies that signed JWT access tokens can be created."""
  user_id = 123
  token = create_access_token(subject=user_id)

  assert isinstance(token, str)
  assert len(token) > 0


def test_decode_token_success():
  """Verifies that a valid JWT token is successfully decoded."""
  user_id = 456
  token = create_access_token(subject=user_id)

  decoded_id = decode_token(token)
  assert decoded_id == user_id


def test_decode_token_invalid():
  """Verifies that decoding an invalid token raises a JWTError."""
  with pytest.raises(JWTError):
    decode_token("this.is.invalid")


def test_decode_token_missing_sub():
  """Verifies that decoding a token without a subject claim raises a JWTError."""
  # Create a token without the 'sub' claim
  expire = datetime.now(timezone.utc) + timedelta(minutes=15)
  payload = {"exp": expire}
  token = jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)

  with pytest.raises(JWTError, match="Missing subject claim."):
    decode_token(token)


def test_decode_token_expired():
  """Verifies that decoding an expired token raises a JWTError."""
  # Create a token that is already expired
  expire = datetime.now(timezone.utc) - timedelta(minutes=15)
  payload = {"sub": "123", "exp": expire}
  token = jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)

  with pytest.raises(JWTError):
    decode_token(token)
