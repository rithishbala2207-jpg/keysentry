Write-Host "--- KeySentry Setup ---" -ForegroundColor Cyan

# Backend Setup
Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
cd backend
python -m venv venv
.\venv\Scripts\activate.ps1
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
Write-Host "Populating mock data..." -ForegroundColor Yellow
python scripts/populate_mock.py
cd ..

# Frontend Setup
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
cd frontend
npm install
cd ..

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "Launch the app:" -ForegroundColor Green
Write-Host "1. Backend: cd backend; .\venv\Scripts\activate; uvicorn app.main:app --reload --port 8000"
Write-Host "2. Frontend: cd frontend; npm run dev"
