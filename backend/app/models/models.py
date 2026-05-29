from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship, declarative_base
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
import uuid

Base = declarative_base()


# SQLAlchemy Models
class Scan(Base):
    __tablename__ = "scans"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    url = Column(String, nullable=False, index=True)
    status = Column(String, default="pending", index=True)
    score = Column(Integer, default=100)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    total_findings = Column(Integer, default=0)
    high_critical_count = Column(Integer, default=0)
    scanner_version = Column(String, default="1.0.0")

    findings = relationship("Finding", back_populates="scan", cascade="all, delete-orphan")


class Finding(Base):
    __tablename__ = "findings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    scan_id = Column(String, ForeignKey("scans.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    masked_value = Column(String, nullable=False)
    evidence = Column(Text, nullable=False)
    source_file = Column(String, nullable=False)
    explanation = Column(Text, nullable=False)
    remediation = Column(Text, nullable=False)
    confidence = Column(Float, default=0.9)

    scan = relationship("Scan", back_populates="findings")


# Pydantic Schemas
class FindingSchema(BaseModel):
    id: str
    scan_id: str
    title: str
    category: str
    severity: str
    masked_value: str
    evidence: str
    source_file: str
    explanation: str
    remediation: str
    confidence: float

    model_config = ConfigDict(from_attributes=True)


class ScanSchema(BaseModel):
    id: str
    url: str
    status: str
    score: int
    started_at: datetime
    completed_at: Optional[datetime]
    total_findings: int
    high_critical_count: int
    scanner_version: str

    model_config = ConfigDict(from_attributes=True)