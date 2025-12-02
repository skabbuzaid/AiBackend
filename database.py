import os
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, JSON, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from dotenv import load_dotenv

load_dotenv()

# Database Setup
# MySQL credentials
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "Shaikh%408788")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "startersql")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")

# Construct DB_URI
if os.getenv("DATABASE_URL"):
    DATABASE_URL = os.getenv("DATABASE_URL")
else:
    DATABASE_URL = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}"
        f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}?charset=utf8mb4"
    )

print(f"Connecting to database: {DATABASE_URL.split('@')[-1]}")

try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
except Exception as e:
    print(f"Error creating engine: {e}")
    DATABASE_URL = "sqlite:///./eduai.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Models

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), index=True)
    role = Column(String(50)) # "user" or "ai"
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(String(50), primary_key=True, index=True) # UUID (increased to 50)
    topic = Column(String(255))
    difficulty = Column(String(50))
    title = Column(String(255))
    questions = Column(JSON) # Store questions as JSON
    session_id = Column(String(255), index=True) # Added session_id
    created_at = Column(DateTime, default=datetime.utcnow)
    
    scores = relationship("QuizScore", back_populates="quiz")

class QuizScore(Base):
    __tablename__ = "quiz_scores"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(String(50), ForeignKey("quizzes.id"))
    session_id = Column(String(255), index=True)
    score = Column(Float)
    correct_count = Column(Integer)
    total_questions = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    quiz = relationship("Quiz", back_populates="scores")

class FlashcardSet(Base):
    __tablename__ = "flashcard_sets"

    id = Column(String(50), primary_key=True, index=True) # UUID (increased to 50)
    topic = Column(String(255))
    title = Column(String(255))
    cards = Column(JSON)
    session_id = Column(String(255), index=True) # Creator
    created_at = Column(DateTime, default=datetime.utcnow)

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(255), index=True)
    name = Column(String(255))
    last_studied = Column(DateTime, default=datetime.utcnow)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()