from anyio import to_thread
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password_sync(password: str) -> str:
    return pwd_context.hash(password)


async def async_hash_password(password: str) -> str:
    return await to_thread.run_sync(pwd_context.hash, password)


def verify_password_sync(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


async def async_verify_password(plain_password: str, hashed_password: str) -> bool:
    return await to_thread.run_sync(pwd_context.verify, plain_password, hashed_password)
