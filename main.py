import os
import json
import uuid
from datetime import datetime
from typing import List, Dict, Any
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

# third-party LLM / search imports
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from duckduckgo_search import DDGS

# DB imports
from sqlalchemy.orm import Session
from database import engine, Base, get_db, Quiz, QuizScore, FlashcardSet, Topic, ChatHistory

# load env early
load_dotenv()

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# -----------------------
# Create FastAPI app
# -----------------------
app = FastAPI(title="EduAI Backend")

# CORS
allowed_origins = os.getenv("CORS_ORIGINS", "*")
if allowed_origins == "*":
    origins = ["*"]
else:
    origins = [o.strip() for o in allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check API Key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("[WARNING] GROQ_API_KEY not found! Some LLM calls may fail.")
else:
    print("[OK] GROQ_API_KEY loaded")

# -----------------------
# Pydantic models
# -----------------------
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    session_id: str

class QuizRequest(BaseModel):
    topic: str
    difficulty: str = "medium"
    num_questions: int = 5
    session_id: str

class QuizSubmission(BaseModel):
    quiz_id: str
    answers: Dict[int, str]
    session_id: str

class FlashcardRequest(BaseModel):
    topic: str
    num_cards: int = 10
    session_id: str

# -----------------------
# AI Helpers
# -----------------------
def get_llm():
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY not configured.")
    return ChatGroq(
        model="openai/gpt-oss-120b", 
        groq_api_key=GROQ_API_KEY,
        temperature=0.7,
        max_tokens=2000
    )

def web_search(query: str) -> str:
    try:
        results = DDGS().text(query, max_results=3)
        if not results:
            return "No results found."
        text = "🔍 **Search Results:**\n\n"
        for idx, r in enumerate(results, 1):
            text += f"{idx}. **{r.get('title')}**\n{r.get('body')}\n\n"
        return text
    except Exception:
        return "Search unavailable."

def chat_response(message: str, session_id: str, db: Session) -> str:
    # Fetch stats from DB
    try:
        quiz_count = db.query(QuizScore).filter(QuizScore.session_id == session_id).count()
        topics = db.query(Topic).filter(Topic.session_id == session_id).order_by(Topic.last_studied.desc()).limit(3).all()
        topic_names = [t.name for t in topics]
        
        # Fetch recent chat history from DB
        history_records = db.query(ChatHistory).filter(ChatHistory.session_id == session_id).order_by(ChatHistory.created_at.asc()).limit(10).all()
        chat_history = []
        for h in history_records:
            if h.role == "user":
                chat_history.append(HumanMessage(content=h.content))
            else:
                chat_history.append(AIMessage(content=h.content))
                
    except Exception as e:
        print(f"Error fetching context: {e}")
        quiz_count = 0
        topic_names = []
        chat_history = []
    
    context = f"""You are a friendly AI tutor. 
User Stats: {quiz_count} quizzes completed, Recent Topics: {', '.join(topic_names) or 'None yet'}
Use markdown formatting. Be encouraging and helpful."""
    
    if any(kw in message.lower() for kw in ['latest', 'current', 'news', '2024', '2025']):
        search_results = web_search(message)
        message = f"{message}\n\n{search_results}"
    
    # Attempt to get llm
    try:
        llm = get_llm()
    except RuntimeError as e:
        return "LLM not configured properly. Please set GROQ_API_KEY in your environment."
    
    messages = [SystemMessage(content=context)] + chat_history + [HumanMessage(content=message)]
    
    response = llm.invoke(messages)
    
    return response.content

# -----------------------
# Utility generators (quizzes / flashcards)
# -----------------------
def generate_quiz(topic: str, difficulty: str, num_questions: int) -> Dict:
    llm = get_llm()
    prompt = f"""Create a {difficulty} difficulty quiz about "{topic}" with {num_questions} questions.

Return ONLY valid JSON in this exact format:
{{
  "title": "Quiz Title",
  "questions": [
    {{
      "id": 1,
      "question": "Question text?",
      "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      "correct_answer": "A",
      "explanation": "Brief explanation"
    }}
  ]
}}"""
    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        quiz_data = json.loads(content)
        return quiz_data
    except Exception:
        # safe fallback
        return {
            "title": f"{topic} Quiz",
            "questions": [{
                "id": 1,
                "question": f"What is an important concept in {topic}?",
                "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
                "correct_answer": "A",
                "explanation": "This is a sample question."
            }]
        }

def generate_flashcards(topic: str, num_cards: int) -> Dict:
    llm = get_llm()
    prompt = f"""Create {num_cards} flashcards about "{topic}".

Return ONLY valid JSON:
{{
  "title": "Flashcard Set Title",
  "cards": [
    {{
      "id": 1,
      "front": "Question",
      "back": "Answer",
      "hint": "Optional hint"
    }}
  ]
}}"""
    try:
        response = llm.invoke([HumanMessage(content=prompt)])
        content = response.content.strip()
        
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        return json.loads(content)
    except Exception:
        return {
            "title": f"{topic} Flashcards",
            "cards": [{
                "id": 1,
                "front": f"What is {topic}?",
                "back": f"A fundamental concept in learning.",
                "hint": "Think about the basics"
            }]
        }

# -----------------------
# API ENDPOINTS
# -----------------------
@app.get("/", response_class=HTMLResponse)
async def home():
    """Serve the main application"""
    if os.path.exists("index.html"):
        with open("index.html", "r", encoding="utf-8") as f:
            return f.read()
    return "index.html not found"

@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "groq_available": bool(GROQ_API_KEY)
    }

@app.post("/api/session")
async def create_session():
    """Create a new session ID"""
    return {"session_id": str(uuid.uuid4())}

@app.post("/api/chat")
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        last_msg = request.messages[-1].content
        
        # Save User Message
        user_msg_db = ChatHistory(
            session_id=request.session_id,
            role="user",
            content=last_msg
        )
        db.add(user_msg_db)
        db.commit()
        
        # Generate Response
        response_text = chat_response(last_msg, request.session_id, db)
        
        # Save AI Response
        ai_msg_db = ChatHistory(
            session_id=request.session_id,
            role="ai",
            content=response_text
        )
        db.add(ai_msg_db)
        db.commit()
        
        return {
            "id": f"chat-{uuid.uuid4().hex[:8]}",
            "response": response_text,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chat/history/{session_id}")
async def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    """Get chat history for a session"""
    history = db.query(ChatHistory).filter(ChatHistory.session_id == session_id).order_by(ChatHistory.created_at.asc()).all()
    return {
        "history": [
            {"role": h.role, "content": h.content, "timestamp": h.created_at.isoformat()}
            for h in history
        ]
    }

@app.post("/api/quiz/generate")
async def create_quiz(request: QuizRequest, db: Session = Depends(get_db)):
    try:
        quiz_data = generate_quiz(request.topic, request.difficulty, request.num_questions)
        quiz_id = f"quiz-{uuid.uuid4().hex}"
        
        # Save to DB
        new_quiz = Quiz(
            id=quiz_id,
            topic=request.topic,
            difficulty=request.difficulty,
            title=quiz_data.get("title", f"{request.topic} Quiz"),
            questions=quiz_data.get("questions", []),
            session_id=request.session_id
        )
        db.add(new_quiz)
        
        # Update Topic
        topic = db.query(Topic).filter(Topic.session_id == request.session_id, Topic.name == request.topic).first()
        if not topic:
            topic = Topic(session_id=request.session_id, name=request.topic)
            db.add(topic)
        else:
            topic.last_studied = datetime.utcnow()
            
        db.commit()
        
        quiz_data["quiz_id"] = quiz_id
        quiz_data["topic"] = request.topic
        quiz_data["difficulty"] = request.difficulty
        quiz_data["created_at"] = datetime.now().isoformat()
        
        return quiz_data
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/quiz/submit")
async def submit_quiz(submission: QuizSubmission, db: Session = Depends(get_db)):
    try:
        quiz = db.query(Quiz).filter(Quiz.id == submission.quiz_id).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        correct = 0
        questions = quiz.questions
        total = len(questions)
        results = []
        
        for q in questions:
            user_ans = submission.answers.get(str(q["id"]), "") if isinstance(submission.answers, dict) else ""
            is_correct = user_ans == q.get("correct_answer", "")
            if is_correct:
                correct += 1
            
            results.append({
                "question_id": q["id"],
                "question": q["question"],
                "user_answer": user_ans,
                "correct_answer": q.get("correct_answer", ""),
                "is_correct": is_correct,
                "explanation": q.get("explanation", "")
            })
        
        score = (correct / total * 100) if total > 0 else 0
        
        # Save Score
        new_score = QuizScore(
            quiz_id=submission.quiz_id,
            session_id=submission.session_id,
            score=score,
            correct_count=correct,
            total_questions=total
        )
        db.add(new_score)
        
        # Update Topic
        topic_name = quiz.topic
        topic = db.query(Topic).filter(Topic.session_id == submission.session_id, Topic.name == topic_name).first()
        if not topic:
            topic = Topic(session_id=submission.session_id, name=topic_name)
            db.add(topic)
        else:
            topic.last_studied = datetime.utcnow()
            
        db.commit()
        
        return {
            "score": round(score, 1),
            "correct": correct,
            "total": total,
            "results": results
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/flashcards/generate")
async def create_flashcards(request: FlashcardRequest, db: Session = Depends(get_db)):
    try:
        cards_data = generate_flashcards(request.topic, request.num_cards)
        set_id = f"flashcard-{uuid.uuid4().hex}"
        
        # Save to DB
        new_set = FlashcardSet(
            id=set_id,
            topic=request.topic,
            title=cards_data.get("title", f"{request.topic} Flashcards"),
            cards=cards_data.get("cards", []),
            session_id=request.session_id
        )
        db.add(new_set)
        
        # Update Topic
        topic = db.query(Topic).filter(Topic.session_id == request.session_id, Topic.name == request.topic).first()
        if not topic:
            topic = Topic(session_id=request.session_id, name=request.topic)
            db.add(topic)
        else:
            topic.last_studied = datetime.utcnow()
            
        db.commit()
        
        cards_data["set_id"] = set_id
        cards_data["topic"] = request.topic
        cards_data["created_at"] = datetime.now().isoformat()
        
        return cards_data
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/progress/{session_id}")
async def get_progress(session_id: str, db: Session = Depends(get_db)):
    # Get Quiz Scores
    scores = db.query(QuizScore).filter(QuizScore.session_id == session_id).order_by(QuizScore.created_at.desc()).all()
    
    total_quizzes = len(scores)
    avg_score = sum(s.score for s in scores) / total_quizzes if total_quizzes > 0 else 0
    
    # Get Flashcard Sets
    flashcard_count = db.query(FlashcardSet).filter(FlashcardSet.session_id == session_id).count()
    
    # Get Topics
    topics_count = db.query(Topic).filter(Topic.session_id == session_id).count()
    
    # Calculate streak
    streak = 0
    if scores:
        dates = sorted(set(s.created_at.date() for s in scores), reverse=True)
        streak = 1
        for i in range(len(dates) - 1):
            if (dates[i] - dates[i+1]).days == 1:
                streak += 1
            else:
                break
    
    recent_quizzes = []
    for s in scores[:5]:
        quiz = db.query(Quiz).filter(Quiz.id == s.quiz_id).first()
        recent_quizzes.append({
            "quiz_id": s.quiz_id,
            "topic": quiz.topic if quiz else "Unknown",
            "score": s.score,
            "date": s.created_at.isoformat()
        })
    
    return {
        "total_quizzes": total_quizzes,
        "average_score": round(avg_score, 1),
        "topics_studied": topics_count,
        "flashcard_sets": flashcard_count,
        "learning_streak": streak,
        "recent_quizzes": recent_quizzes
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)