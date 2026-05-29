import sys
import os
from datetime import datetime, timedelta
import uuid
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker

# Add parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.models import Base, Scan, Finding

sqlite_url = "sqlite:///../keysentry.db"
engine = create_engine(sqlite_url)
SessionLocal = sessionmaker(bind=engine)

def populate():
    Base.metadata.create_all(engine)
    
    with SessionLocal() as session:
        # Check if already populated
        existing = session.execute(select(Scan)).scalars().first()
        if existing:
            print("Database already contains data. Skipping populate.")
            return

        mock_scans = [
            {
                "url": "https://dashboard.demo-sec.com",
                "score": 42,
                "status": "completed",
                "findings": [
                    {
                        "title": "AWS Access Key",
                        "category": "Secret Leak",
                        "severity": "High",
                        "masked": "AKIA********3X4Y",
                        "file": "https://dashboard.demo-sec.com/static/js/main.chunk.js"
                    },
                    {
                        "title": "OpenAI Key",
                        "category": "Secret Leak",
                        "severity": "Critical",
                        "masked": "sk-12ab********89xy",
                        "file": "https://dashboard.demo-sec.com/static/js/vendor.chunk.js"
                    },
                    {
                        "title": "Insecure Placeholder",
                        "category": "AI Code Smell",
                        "severity": "Medium",
                        "masked": "YOUR_API_KEY_HERE",
                        "file": "https://dashboard.demo-sec.com/index.html"
                    }
                ]
            },
            {
                "url": "https://safe-app.io",
                "score": 98,
                "status": "completed",
                "findings": [
                    {
                        "title": "Console Debug",
                        "category": "Info Leak / Hygiene",
                        "severity": "Low",
                        "masked": "console.log('User logged in')",
                        "file": "https://safe-app.io/app.js"
                    }
                ]
            }
        ]

        for s_data in mock_scans:
            scan_id = str(uuid.uuid4())
            scan = Scan(
                id=scan_id,
                url=s_data["url"],
                score=s_data["score"],
                status=s_data["status"],
                total_findings=len(s_data["findings"]),
                high_critical_count=len([f for f in s_data["findings"] if f["severity"] in ["High", "Critical"]]),
                started_at=datetime.utcnow() - timedelta(days=1)
            )
            session.add(scan)
            
            for f_data in s_data["findings"]:
                finding = Finding(
                    scan_id=scan_id,
                    title=f_data["title"],
                    category=f_data["category"],
                    severity=f_data["severity"],
                    masked_value=f_data["masked"],
                    source_file=f_data["file"],
                    evidence=f"// Match found in code snippet relating to {f_data['title']}",
                    explanation=f"Detected a match for {f_data['title']}.",
                    remediation="Rotate this credential immediately."
                )
                session.add(finding)
        
        session.commit()
    print("Mock data populated successfully.")

if __name__ == "__main__":
    populate()
