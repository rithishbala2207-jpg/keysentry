#!/bin/bash

echo -e "\033[0;36m--- KeySentry Setup ---\033[0m"

# Backend Setup
echo -e "\033[0;33mCreating Python virtual environment...\033[0m"
cd backend
python3 -m venv venv
source venv/bin/activate
echo -e "\033[0;33mInstalling backend dependencies...\033[0m"
pip install -r requirements.txt
echo -e "\033[0;33mPopulating mock data...\033[0m"
python3 scripts/populate_mock.py
cd ..

# Frontend Setup
echo -e "\033[0;33mInstalling frontend dependencies...\033[0m"
cd frontend
npm install
cd ..

echo -e "\033[0;32mSetup complete!\033[0m"
echo -e "\033[0;32mLaunch the app:\033[0m"
echo -e "1. Backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000"
echo -e "2. Frontend: cd frontend && npm run dev"
