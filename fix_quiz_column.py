from database import engine
from sqlalchemy import text

def add_column():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE quiz_scores ADD COLUMN details JSON"))
            print("Successfully added 'details' column to 'quiz_scores'")
        except Exception as e:
            print(f"Error (might already exist): {e}")

if __name__ == "__main__":
    add_column()
