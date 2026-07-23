import os
from pathlib import Path

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

JWT_ACCESS_KEY = os.getenv("JWT_ACCESS_KEY", "my_secret_key")
JWT_REFRESH_KEY = os.getenv("JWT_REFRESH_KEY", "my_secret_key")

HOST = os.getenv("HOST", "localhost")
PORT = int(os.getenv("PORT", 5000))
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

SMTP_HOST = os.getenv("SMTP_HOST", "0.0.0.0")
SMTP_PORT = int(os.getenv("SMTP_PORT", "8000"))
SMTP_MAIL = os.getenv("SMTP_MAIL", "something@gmail.com")
SMTP_USER = os.getenv("SMTP_USER", "something")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "1234")

API_URL = os.getenv("API_URL", "https://backend-petrenckovilya.amvera.io")
CLIENT_URL = os.getenv(
    "CLIENT_URL", "https://health-client-petrenckovilya.amvera.io/profile/me"
)

ULM_URL = os.getenv("ULM_URL", "https://roslis.ru/")
ULM_ACCESS_KEY = os.getenv("ULM_ACCESS_KEY", "ulm_access_key")

UPLOAD_FOLDER = Path("/data/uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
