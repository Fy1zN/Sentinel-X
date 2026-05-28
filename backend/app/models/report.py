
from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from sqlalchemy.sql import func

from app.database.base import Base


class Report(Base):

    __tablename__ = "reports"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    report_name = Column(
        String,
        nullable=False
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

    threat_score = Column(
        Integer,
        default=0
    )

    summary = Column(
        Text,
        nullable=True
    )

    mitre_attack = Column(
        Text,
        nullable=True
    )

    source_intelligence = Column(
        Text,
        nullable=True
    )

    analyst_notes = Column(
        Text,
        nullable=True
    )

    pdf_path = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

