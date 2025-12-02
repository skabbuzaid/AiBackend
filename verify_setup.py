import os
import sys
from sqlalchemy import inspect
from main import engine, Base

def verify():
    print("🔍 Verifying Database Setup...")
    
    try:
        # Connect
        with engine.connect() as connection:
            print("✅ Database connection successful.")
            
            # Check tables
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            
            expected_tables = ["user_sessions", "chats", "quizzes", "quiz_scores", "flashcard_sets", "topics"]
            missing = [t for t in expected_tables if t not in tables]
            
            if missing:
                print(f"❌ Missing tables: {missing}")
                # Try creating them
                print("Attempting to create tables...")
                Base.metadata.create_all(bind=engine)
                print("✅ Tables created.")
            else:
                print(f"✅ All {len(tables)} tables present: {', '.join(tables)}")
                
    except Exception as e:
        print(f"❌ Database error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify()
