from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

from app.core.config import DATABASE_URL

# Асинхронный движок (для PostgreSQL используем asyncpg)
async_engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Логирование запросов (можно отключить)
)

# Асинхронная сессия
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine, class_=AsyncSession, expire_on_commit=False, autoflush=False
)


async def get_async_db():
    async with AsyncSessionLocal() as db:
        try:
            yield db
        finally:
            await db.close()
