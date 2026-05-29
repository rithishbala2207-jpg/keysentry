from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

from .models.models import Base, Scan, Finding, ScanSchema, FindingSchema
from .scanner.engine import ScannerEngine

app = FastAPI(title="KeySentry API", description="AI-powered Frontend Secret Leak Scanner")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sqlite_url = "sqlite:///./keysentry.db"
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_db_and_tables():
    Base.metadata.create_all(engine)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

scanner = ScannerEngine()

@app.get("/health")
def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

@app.post("/scan")
async def start_scan(url: str, db: Session = Depends(get_session)):
    if not url.startswith("http"):
        url = f"https://{url}"
        
    try:
        scan_id = str(uuid.uuid4())
        new_scan = Scan(id=scan_id, url=url, status="running")
        db.add(new_scan)
        db.commit()
        db.refresh(new_scan)
        
        result = await scanner.scan_url(url)
        
        if "error" in result:
             new_scan.status = "failed"
             db.commit()
             return result

        new_scan.status = "completed"
        new_scan.score = result["score"]
        new_scan.completed_at = datetime.utcnow()
        new_scan.total_findings = len(result["findings"])
        
        high_critical = [f for f in result["findings"] if f["severity"] in ["High", "Critical"]]
        new_scan.high_critical_count = len(high_critical)
        
        for f_data in result["findings"]:
            finding = Finding(
                scan_id=scan_id,
                title=f_data["title"],
                category=f_data["category"],
                severity=f_data["severity"],
                masked_value=f_data["masked_value"],
                evidence=f_data["evidence"],
                source_file=f_data["source_file"],
                explanation=f_data["explanation"],
                remediation=f_data["remediation"],
                confidence=f_data["confidence"]
            )
            db.add(finding)
        
        db.commit()
        db.refresh(new_scan)
        return {"id": scan_id, "url": url, "score": new_scan.score, "status": "completed"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/scans", response_model=List[ScanSchema])
async def list_scans(db: Session = Depends(get_session)):
    scans = db.execute(select(Scan).order_by(Scan.started_at.desc())).scalars().all()
    return scans

@app.get("/scan/{scan_id}")
async def get_scan(scan_id: str, db: Session = Depends(get_session)):
    scan = db.get(Scan, scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    findings = db.execute(select(Finding).where(Finding.scan_id == scan_id)).scalars().all()
    
    return {
        "id": scan.id,
        "url": scan.url,
        "status": scan.status,
        "score": scan.score,
        "started_at": scan.started_at,
        "completed_at": scan.completed_at,
        "total_findings": scan.total_findings,
        "high_critical_count": scan.high_critical_count,
        "findings": findings
    }
