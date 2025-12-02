import os
import uuid
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from database import Base, Quiz, QuizScore, FlashcardSet, Topic
from dotenv import load_dotenv

load_dotenv()

# MySQL credentials
MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
MYSQL_USER = os.getenv("MYSQL_USER", "root")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "Shaikh%408788")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE", "startersql")
MYSQL_PORT = os.getenv("MYSQL_PORT", "3306")

DATABASE_URL = (
    f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}"
    f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}?charset=utf8mb4"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def debug():
    print("--- Inspecting Database Schema ---")
    inspector = inspect(engine)
    columns = inspector.get_columns("quizzes")
    print("Columns in 'quizzes' table:")
    for c in columns:
        print(f"- {c['name']} ({c['type']})")

    print("\n--- Inspecting SQLAlchemy Model ---")
    print("Quiz.__table__.columns:")
    for c in Quiz.__table__.columns:
        print(f"- {c.name}")

    print("\n--- Attempting Insert ---")
    db = SessionLocal()
    try:
        quiz_id = f"debug-{uuid.uuid4().hex}"
        new_quiz = Quiz(
            id=quiz_id,
            topic="Debug Topic",
            difficulty="easy",
            title="Debug Quiz",
            questions=[],
            session_id="debug-session-id"
        )
        print(f"Created Quiz object: {new_quiz.__dict__}")
        db.add(new_quiz)
        db.commit()
        print("Insert Successful!")
    except Exception as e:
        print(f"Insert Failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    debug()
