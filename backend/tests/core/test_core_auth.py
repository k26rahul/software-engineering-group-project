import pytest
from jose import JWTError

from core.auth import (
    create_access_token,
    decode_token,
    hash_password,
    verify_password,
)


def test_hash_and_verify_password():
    password = "supersecretpassword"
    hashed = hash_password(password)

    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrongpassword", hashed) is False


def test_create_access_token():
    user_id = 123
    token = create_access_token(subject=user_id)

    assert isinstance(token, str)
    assert len(token) > 0


def test_decode_token_success():
    user_id = 456
    token = create_access_token(subject=user_id)

    decoded_id = decode_token(token)
    assert decoded_id == user_id


def test_decode_token_invalid():
    with pytest.raises(JWTError):
        decode_token("this.is.invalid")


def test_decode_token_missing_sub():
    from jose import jwt
    from core.config import settings
    from datetime import datetime, timedelta, timezone

    # Create a token without the 'sub' claim
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    payload = {"exp": expire}
    token = jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)

    with pytest.raises(JWTError, match="Missing subject claim."):
        decode_token(token)


def test_decode_token_expired():
    from jose import jwt
    from core.config import settings
    from datetime import datetime, timedelta, timezone

    # Create a token that is already expired
    expire = datetime.now(timezone.utc) - timedelta(minutes=15)
    payload = {"sub": "123", "exp": expire}
    token = jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)

    with pytest.raises(JWTError):
        decode_token(token)
