import os
from sqlalchemy import create_engine, text, inspect
from dotenv import load_dotenv
from database import Base, ChatHistory, Quiz, QuizScore, FlashcardSet, Topic

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

def fix_schema():
    with engine.connect() as conn:
        # Drop 'data' column from quizzes if exists
        try:
            print("Attempting to drop 'data' column from 'quizzes'...")
            conn.execute(text("ALTER TABLE quizzes DROP COLUMN data"))
            conn.commit()
            print("Success: Dropped 'data' column.")
        except Exception as e:
            print(f"Error dropping 'data' column (maybe it doesn't exist?): {e}")

        # Drop 'data' column from flashcard_sets if exists (cleanup)
        try:
            print("Attempting to drop 'data' column from 'flashcard_sets'...")
            conn.execute(text("ALTER TABLE flashcard_sets DROP COLUMN data"))
            conn.commit()
            print("Success: Dropped 'data' column.")
        except Exception as e:
            print(f"Error dropping 'data' column from flashcard_sets: {e}")

if __name__ == "__main__":
    try:
        fix_schema()
        print("Database schema verification completed.")
    except Exception as e:
        print(f"Critical Error: {e}")
