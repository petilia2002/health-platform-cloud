from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession


@asynccontextmanager
async def transactional(db: AsyncSession):
    try:
        yield
        await db.commit()
    except Exception:
        await db.rollback()
        raise
