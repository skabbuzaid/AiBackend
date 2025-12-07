# Continue from main.py...

# -----------------------
# API ENDPOINTS
# -----------------------

@app.get("/", response_class=HTMLResponse)
async def dashboard():
    """Main dashboard with navigation"""
    return FileResponse("static/index.html")

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "available_models": ai_manager.list_available_models()
    }

# -----------------------
# Chat Endpoints
# -----------------------
@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Chat with AI tutor"""
    try:
        last_message = request.messages[-1]
        response_text = chat_with_context(
            last_message.content,
            request.session_id,
            request.model
        )
        
        # Save to history
        session_manager.add_message(request.session_id, "user", last_message.content)
        session_manager.add_message(request.session_id, "assistant", response_text)
        
        return {
            "id": f"chat-{uuid.uuid4().hex[:8]}",
            "response": response_text,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get chat history"""
    session = session_manager.get_or_create_session(session_id)
    history = []
    
    for msg in session["chat_history"]:
        if isinstance(msg, HumanMessage):
            history.append({"role": "user", "content": msg.content})
        elif isinstance(msg, AIMessage):
            history.append({"role": "assistant", "content": msg.content})
    
    return {"history": history, "context": session["context"]}

# -----------------------
# Quiz Endpoints
# -----------------------
@app.post("/api/quiz/generate")
async def create_quiz(request: QuizRequest):
    """Generate a new quiz"""
    try:
        quiz_data = generate_quiz(
            request.topic,
            request.difficulty,
            request.num_questions
        )
        
        quiz_id = f"quiz-{uuid.uuid4().hex}"
        quiz_data["quiz_id"] = quiz_id
        quiz_data["session_id"] = request.session_id
        
        db.save_quiz(quiz_id, quiz_data)
        session_manager.update_context(request.session_id, "quizzes_taken", quiz_id)
        session_manager.update_context(request.session_id, "topics_discussed", request.topic)
        
        return quiz_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/quiz/submit")
async def submit_quiz(submission: QuizSubmission):
    """Submit quiz answers and get score"""
    try:
        quiz_data = db.get_quiz(submission.quiz_id)
        if not quiz_data:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        # Calculate score
        correct = 0
        total = len(quiz_data["questions"])
        results = []
        
        for q in quiz_data["questions"]:
            q_id = q["id"]
            # Clean and normalize answers for comparison
            import re
            
            user_ans = submission.answers.get(str(q_id), "")

            def extract_option_char(text):
                if not text: return ""
                match = re.match(r"^[\s\(]*([A-Da-d0-9])[\s\)\.]", text.strip())
                if match:
                    return match.group(1).upper()
                clean = text.strip().upper()
                return clean if len(clean) == 1 else clean[:1]

            correct_char = extract_option_char(q.get("correct_answer", ""))
            user_char = extract_option_char(user_ans)
            
            is_correct = (correct_char == user_char) and (correct_char != "")
            
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
        
        # Save to progress
        progress = db.get_user_progress(submission.session_id)
        progress["quiz_scores"].append({
            "quiz_id": submission.quiz_id,
            "topic": quiz_data.get("topic", "Unknown"),
            "score": score,
            "date": datetime.now().isoformat(),
            "details": results
        })
        db.update_user_progress(submission.session_id, progress)
        
        return {
            "score": round(score, 1),
            "correct": correct,
            "total": total,
            "results": results,
            "message": "Great job!" if score >= 70 else "Keep practicing!"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/quiz/{quiz_id}")
async def get_quiz(quiz_id: str):
    """Get quiz by ID"""
    quiz = db.get_quiz(quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

# -----------------------
# Flashcard Endpoints
# -----------------------
@app.post("/api/flashcards/generate")
async def create_flashcards(request: FlashcardRequest):
    """Generate flashcard set"""
    try:
        cards_data = generate_flashcards(request.topic, request.num_cards)
        
        set_id = f"flashcard-{uuid.uuid4().hex}"
        cards_data["set_id"] = set_id
        cards_data["session_id"] = request.session_id
        
        db.save_flashcard_set(set_id, cards_data)
        session_manager.update_context(request.session_id, "flashcards_reviewed", set_id)
        session_manager.update_context(request.session_id, "topics_discussed", request.topic)
        
        return cards_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/flashcards/{set_id}")
async def get_flashcards(set_id: str):
    """Get flashcard set by ID"""
    cards = db.flashcards.get(set_id)
    if not cards:
        raise HTTPException(status_code=404, detail="Flashcard set not found")
    return cards

@app.get("/api/flashcards/user/{session_id}")
async def get_user_flashcards(session_id: str):
    """Get all flashcard sets for a user"""
    session = session_manager.get_or_create_session(session_id)
    set_ids = session["context"]["flashcards_reviewed"]
    
    flashcard_sets = []
    for set_id in set_ids:
        cards = db.flashcards.get(set_id)
        if cards:
            flashcard_sets.append({
                "set_id": set_id,
                "title": cards.get("title", "Untitled"),
                "topic": cards.get("topic", "Unknown"),
                "card_count": len(cards.get("cards", [])),
                "created_at": cards.get("created_at", "")
            })
    
    return {"flashcard_sets": flashcard_sets}

# -----------------------
# Progress & Analytics
# -----------------------
@app.get("/api/progress/{session_id}")
async def get_progress(session_id: str):
    """Get user's learning progress"""
    progress = db.get_user_progress(session_id)
    session = session_manager.get_or_create_session(session_id)
    
    # Calculate statistics
    total_quizzes = len(progress["quiz_scores"])
    avg_score = 0
    if total_quizzes > 0:
        avg_score = sum(s["score"] for s in progress["quiz_scores"]) / total_quizzes
    
    topics_count = len(set(progress["topics_studied"]))
    
    return {
        "total_quizzes": total_quizzes,
        "average_score": round(avg_score, 1),
        "topics_studied": topics_count,
        "flashcard_sets": len(session["context"]["flashcards_reviewed"]),
        "recent_quizzes": progress["quiz_scores"][-5:],
        "learning_streak": calculate_streak(progress["quiz_scores"])
    }

def calculate_streak(quiz_scores: List[Dict]) -> int:
    """Calculate learning streak in days"""
    if not quiz_scores:
        return 0
    
    dates = [datetime.fromisoformat(q["date"]).date() for q in quiz_scores]
    dates.sort(reverse=True)
    
    streak = 1
    for i in range(len(dates) - 1):
        diff = (dates[i] - dates[i + 1]).days
        if diff == 1:
            streak += 1
        elif diff > 1:
            break
    
    return streak

# -----------------------
# Models & Settings
# -----------------------
@app.get("/api/models")
async def list_models():
    """List available AI models"""
    return {
        "models": [
            {
                "id": "groq",
                "name": "Groq LLaMA 3 70B",
                "description": "Fast and reliable",
                "available": "groq" in ai_manager.models
            },
            {
                "id": "huggingface",
                "name": "HuggingFace LLaMA 3 8B",
                "description": "Free and open source",
                "available": "huggingface" in ai_manager.models
            }
        ]
    }

# -----------------------
# Companion Endpoints
# -----------------------
from utils.companion_brain import companion_brain

@app.post("/api/companion/state")
async def get_companion_state(request: dict):
    """Get companion state based on context"""
    try:
        return companion_brain.get_state(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)