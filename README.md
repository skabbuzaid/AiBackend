# 🎓 EduAI - Smart Learning Platform

> A full-stack AI-powered education platform with quizzes, flashcards, personalized AI tutoring, and comprehensive learning analytics. Built with FastAPI, LangChain, and modern web technologies.

![Version](https://img.shields.io/badge/version-3.0.0-blue)
![Python](https://img.shields.io/badge/python-3.8+-green)
![License](https://img.shields.io/badge/license-MIT-orange)

---

## ✨ Features

### 🤖 AI-Powered Learning
- **Multi-Model Support**: Groq (fast), HuggingFace (free), easy to add more
- **Smart AI Tutor**: Context-aware conversations with your learning history
- **Web Search Integration**: Real-time information from the internet
- **Personalized Responses**: AI knows your quiz scores, flashcards, and topics

### 📝 Quiz System
- **Auto-Generation**: AI creates quizzes from any topic
- **Difficulty Levels**: Easy, Medium, Hard
- **Instant Grading**: With explanations for wrong answers
- **Progress Tracking**: All scores saved and analyzed

### 🎴 Flashcard System
- **Smart Generation**: AI creates study cards from topics
- **Spaced Repetition**: Optimal learning intervals
- **Progress Tracking**: Review history and mastery levels
- **Export & Share**: Share flashcard sets with others

### 📊 Analytics & Progress
- **Learning Dashboard**: Beautiful visualizations
- **Score Trends**: Chart your improvement over time
- **Streak Tracking**: Daily learning streaks
- **Topic Mastery**: See which subjects you've mastered

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful translucent effects
- **iPhone-Style Buttons**: Smooth, premium interactions
- **Responsive Design**: Works on desktop, tablet, mobile
- **Dark Mode Ready**: Easy on the eyes
- **Markdown Support**: Rich text formatting in chat

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- API Keys:
  - **Groq API** (Required): https://console.groq.com/keys
  - **HuggingFace API** (Optional, free): https://huggingface.co/settings/tokens

### Installation

```bash
# 1. Clone/Create Project
mkdir eduai-platform && cd eduai-platform

# 2. Create Virtual Environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install Dependencies
pip install -r requirements.txt

# 4. Set Up Environment Variables
cp .env.example .env
# Edit .env with your API keys
```

### Configuration

Create a `.env` file:

```env
# Required
GROQ_API_KEY=gsk_your_groq_api_key_here

# Optional (for free HuggingFace models)
HUGGINGFACE_API_KEY=hf_your_huggingface_token_here
```

### Run the Application

```bash
# Development mode
uvicorn main:app --reload

# Production mode
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

Visit: **http://localhost:8000**

---

## 📁 Project Structure

```
eduai-platform/
│
├── main.py                 # Core backend logic & AI
├── routes.py               # API endpoints
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
│
├── static/                 # Frontend files
│   ├── index.html         # Main dashboard
│   ├── chat.html          # AI tutor chat
│   ├── quiz.html          # Quiz interface
│   └── flashcards.html    # Flashcard viewer
│
├── models/                 # AI model configurations
│   ├── groq_model.py
│   └── huggingface_model.py
│
└── utils/                  # Utility functions
    ├── memory.py          # Enhanced memory system
    └── analytics.py       # Progress analytics
```

---

## 🎯 API Endpoints

### Chat
- `POST /api/chat` - Chat with AI tutor
- `GET /api/chat/history/{session_id}` - Get chat history

### Quizzes
- `POST /api/quiz/generate` - Generate new quiz
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/{quiz_id}` - Get quiz by ID

### Flashcards
- `POST /api/flashcards/generate` - Generate flashcards
- `GET /api/flashcards/{set_id}` - Get flashcard set
- `GET /api/flashcards/user/{session_id}` - User's flashcards

### Progress
- `GET /api/progress/{session_id}` - Get learning analytics
- `GET /api/models` - List available AI models

### Health
- `GET /api/health` - System health check

---

## 💡 Usage Examples

### Generate a Quiz

```python
import requests

response = requests.post('http://localhost:8000/api/quiz/generate', json={
    "topic": "Python Programming",
    "difficulty": "medium",
    "num_questions": 5,
    "session_id": "user-123"
})

quiz = response.json()
print(f"Quiz ID: {quiz['quiz_id']}")
```

### Chat with AI Tutor

```python
response = requests.post('http://localhost:8000/api/chat', json={
    "messages": [
        {"role": "user", "content": "Explain recursion with examples"}
    ],
    "session_id": "user-123",
    "model": "groq"
})

print(response.json()['response'])
```

### Create Flashcards

```python
response = requests.post('http://localhost:8000/api/flashcards/generate', json={
    "topic": "Machine Learning Basics",
    "num_cards": 10,
    "session_id": "user-123"
})

flashcards = response.json()
```

---

## 🔧 Advanced Configuration

### Add Custom AI Models

Edit `main.py`:

```python
# Add OpenAI
from langchain_openai import ChatOpenAI

self.models["openai"] = ChatOpenAI(
    model="gpt-4",
    api_key=os.getenv("OPENAI_API_KEY")
)
```

### Database Integration (PostgreSQL)

```bash
pip install psycopg2-binary sqlalchemy
```

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:pass@localhost/eduai"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
```

### Redis Caching

```bash
pip install redis
```

```python
import redis

cache = redis.Redis(host='localhost', port=6379, db=0)
cache.set('key', 'value', ex=3600)  # 1 hour expiry
```

---

## 🎨 UI Customization

### Color Schemes

Edit CSS variables in `index.html`:

```css
:root {
    --primary: #6366f1;        /* Indigo */
    --secondary: #ec4899;      /* Pink */
    --success: #10b981;        /* Green */
    --warning: #f59e0b;        /* Amber */
}
```

### Add Custom Pages

1. Create new HTML file in `static/`
2. Add navigation button
3. Create corresponding API endpoint

---

## 📊 Features Roadmap

- [x] Multi-model AI support (Groq, HuggingFace)
- [x] Quiz generation and grading
- [x] Flashcard system
- [x] Progress tracking
- [x] Web search integration
- [x] Markdown formatting
- [ ] User authentication (OAuth, JWT)
- [ ] Real-time collaboration
- [ ] Voice input/output
- [ ] Mobile app (React Native)
- [ ] Spaced repetition algorithm
- [ ] Peer-to-peer learning
- [ ] Teacher dashboard
- [ ] Course creation tools
- [ ] Video lessons integration
- [ ] Gamification (badges, levels)

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

MIT License - feel free to use for personal or commercial projects.

---

## 🆘 Troubleshooting

### Common Issues

**1. Import Errors**
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

**2. API Key Not Found**
- Check `.env` file exists
- Verify `GROQ_API_KEY` is set
- Restart server after changing `.env`

**3. Model Not Loading**
```python
# Check available models
curl http://localhost:8000/api/models
```

**4. Port Already in Use**
```bash
# Use different port
uvicorn main:app --port 8001
```

---

## 💰 Cost Optimization

### Free Tier Usage
- **Groq**: 14,400 requests/day free
- **HuggingFace**: Unlimited inference API calls
- **DuckDuckGo Search**: Unlimited, free

### Reduce API Calls
1. **Cache responses**: Store common quiz/flashcard topics
2. **Batch requests**: Generate multiple items at once
3. **Use HuggingFace**: For non-critical tasks
4. **Limit search**: Only search when keywords detected

---

## 📚 Learning Resources

- [LangChain Docs](https://python.langchain.com/docs/get_started/introduction)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Groq API Docs](https://console.groq.com/docs)
- [HuggingFace Hub](https://huggingface.co/docs/hub/index)

---

## 🌟 Credits

Built with:
- **FastAPI** - Modern Python web framework
- **LangChain** - AI orchestration framework
- **Groq** - Lightning-fast LLM inference
- **HuggingFace** - Open-source AI models
- **Chart.js** - Beautiful data visualizations
- **Marked.js** - Markdown parsing
- **Highlight.js** - Code syntax highlighting

---

## 📧 Support

- 📖 Documentation: Check this README
- 🐛 Bug Reports: Create an issue
- 💡 Feature Requests: Open a discussion
- 📧 Email: your-email@example.com

---

**Made with ❤️ for learners worldwide 🌍**