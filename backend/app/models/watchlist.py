
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from app.database.base import Base


class Watchlist(Base):

    __tablename__ = "watchlist"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    ioc = Column(
        String,
        nullable=False
    )

    ioc_type = Column(
        String,
        nullable=False
    )

    severity = Column(
        String,
        default="medium"
    )

    notes = Column(
        String,
        nullable=True
    )

    is_active = Column(
        Boolean,
        default=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    last_triggered = Column(
        DateTime(timezone=True),
        nullable=True
    )
