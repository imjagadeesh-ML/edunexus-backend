from passlib.context import CryptContext
import sys

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
password = "demo123"
hashed = pwd_context.hash(password)
print(f"---HASH_START---")
print(hashed)
print(f"---HASH_END---")
print(f"Verification: {pwd_context.verify(password, hashed)}")
