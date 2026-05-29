# KeySentry Implementation Walkthrough

KeySentry is a modular security assessment tool designed to find client-side vulnerabilities. Below is the technical breakdown.

## 1. Backend Architecture (FastAPI)

The backend is built with **FastAPI** for high performance and **SQLModel** for a modern ORM experience.

### Main Components:
- **`app/main.py`**: The API gateway. It manages scan lifecycle, database sessions, and endpoints.
- **`app/scanner/engine.py`**: The orchestration layer. It handles asset discovery, parallel fetching of JS assets, and parsing source maps.
- **`app/detectors/`**: A pluggable detector system.
    - **API Key Detector**: Matches patterns like `AKIA...` (AWS) or `sk-` (OpenAI).
    - **Info Leak Detector**: Finds internal IP addresses, admin paths, and debug metadata.
    - **AI Code Smell Detector**: Analyzes code for copy-pasted LLM insecurities like `INSERT_SECRET_HERE`.

### Database Schema:
- **`Scan` Table**: Stores metadata about each scan (URL, score, status, timestamps).
- **`Finding` Table**: Stores specific vulnerabilities found, including evidence snippets and localized remediation advice.

## 2. Detection Logic

We use a combination of **High-Entropy Regex** and **Context Awareness**:

### Example Detection Pattern (AWS):
```python
"AWS Access Key": {
    "regex": r"AKIA[0-9A-Z]{16}",
    "severity": "High",
    "remediation": "Revoke the access key and rotate with restricted IAM roles."
}
```

## 3. Frontend Architecture (React)

The UI is built with **Vite React** and styled with a custom **Tailwind CSS** theme focused on cybersecurity aesthetics.

### Key Features:
- **Dynamic Dashboard**: Real-time progress tracking while the backend scans.
- **Security Scoreboard**: Gauges and charts (via Recharts) visualize the health of a website.
- **Filtering & Search**: The history page allows quick retrieval of past scans by URL or timestamp.

## 4. How to Use

1. **Launch Backend**:
   - `python -m venv venv`
   - `pip install -r requirements.txt`
   - `uvicorn app.main:app --reload --port 8000`

2. **Launch Frontend**:
   - `npm install`
   - `npm run dev`

3. **Scan URL**:
   - Enter a target URL in the "Scan" page.
   - Wait for the "AI Risk Engine" to complete.
   - Review the detailed remediation report.

## 🔒 Security Considerations

KeySentry masks all detected findings in the UI (e.g., `sk-12ab********89xy`) to prevent secondary leakage through the dashboard itself.
