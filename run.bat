@echo off
echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install sqlalchemy pymysql fastapi uvicorn python-dotenv langchain-groq duckduckgo-search

echo Starting EduAI Server...
uvicorn main:app --reload --host 127.0.0.1 --port 8000
pause
