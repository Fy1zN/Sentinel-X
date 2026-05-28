from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database.base import Base


class IOCHistory(Base):
    __tablename__ = "ioc_history"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    ioc = Column(String, nullable=False)

    ioc_type = Column(String, nullable=False)

    risk_score = Column(Integer)

    status = Column(String)

    country = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )   