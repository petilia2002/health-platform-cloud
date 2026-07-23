from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.routers import authRouter
from app.routers import sampleRouter

from app.routers import predictionRouter
from app.routers import profileRouter
from app.routers import userRouter
from app.routers import requestRouter

from app.db.database import async_engine
from app.models.models import Base
from app.core.config import UPLOAD_FOLDER

from app.middlewares.errorHandlingMiddleware import ErrorHandlingMiddleware

PHOTOS_DIR = UPLOAD_FOLDER / "photos"
ICONS_DIR = UPLOAD_FOLDER / "icons"

# Создаём папки ДО монтирования статики
PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
ICONS_DIR.mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Код, выполняемый при запуске приложения
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Код, выполняемый при остановке приложения
    await async_engine.dispose()


app = FastAPI(
    title="My FastAPI App",
    description="A sample FastAPI application with well-organized structure",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(ErrorHandlingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://health-client-petrenckovilya.amvera.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Монтируем статические папки из постоянного хранилища
app.mount(
    "/api/upload/photos",
    StaticFiles(directory=str(PHOTOS_DIR)),
    name="photos",
)
app.mount(
    "/api/upload/icons",
    StaticFiles(directory=str(ICONS_DIR)),
    name="icons",
)

# Включаем асинхронные роутеры
app.include_router(authRouter.router, prefix="/auth")
app.include_router(sampleRouter.router, prefix="/api")
app.include_router(predictionRouter.router, prefix="/api")
app.include_router(profileRouter.router, prefix="/api")
app.include_router(userRouter.router, prefix="/api")
app.include_router(requestRouter.router, prefix="/api")


# Асинхронный корневой эндпоинт
@app.get("/")
async def root():
    return {"Message": "Welcome to my FastAPI application!"}
