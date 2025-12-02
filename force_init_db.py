from database import engine, Base
# Import models to ensure they are registered
from database import Quiz, QuizScore, FlashcardSet, Topic

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully.")
