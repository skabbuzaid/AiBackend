import os
from dotenv import load_dotenv
from duckduckgo_search import DDGS
from typing import List, Optional, Dict
from datetime import datetime
import uuid

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

# Check for API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    print("⚠️  WARNING: GROQ_API_KEY not found in environment variables!")
    print("Please create a .env file with: GROQ_API_KEY=your_key_here")
else:
    print(f"✅ GROQ_API_KEY loaded: {GROQ_API_KEY[:10]}...{GROQ_API_KEY[-4:]}")

# -----------------------
# FastAPI App Setup
# -----------------------
app = FastAPI(
    title="LangChain AI Chatbot API",
    description="OpenAI-style chatbot with web search capabilities",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Pydantic Models
# -----------------------
class Message(BaseModel):
    role: str
    content: str
    timestamp: Optional[str] = None

class ChatRequest(BaseModel):
    messages: List[Message]
    session_id: Optional[str] = "default"
    model: Optional[str] = "llama3-70b-8192"
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 8000
    use_search: Optional[bool] = True

class ChatResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    session_id: str
    choices: List[dict]
    usage: dict

class HealthResponse(BaseModel):
    status: str
    timestamp: str

class SessionHistoryResponse(BaseModel):
    session_id: str
    messages: List[Message]
    total_messages: int

# -----------------------
# Web Search Function (Simple Implementation)
# -----------------------
def web_search_function(query: str) -> str:
    """Search the web for current information"""
    try:
        results = DDGS().text(query, max_results=5)
        if not results:
            return "No results found."
        
        text = "🔍 Search Results:\n\n"
        for idx, r in enumerate(results, 1):
            text += f"{idx}. **{r.get('title', 'No title')}**\n"
            text += f"   {r.get('body', 'No description')}\n"
            text += f"   Source: {r.get('href', 'N/A')}\n\n"
        return text
    except Exception as e:
        return f"Search error: {str(e)}"

# -----------------------
# Simple Agent Logic (No LangChain Agent Framework)
# -----------------------
def should_search(query: str) -> bool:
    """Determine if query needs web search"""
    search_keywords = [
        'latest', 'current', 'news', 'today', 'recent', 'now',
        'weather', 'price', 'stock', 'what is happening', 'updates',
        '2024', '2025', 'this year', 'this month'
    ]
    query_lower = query.lower()
    return any(keyword in query_lower for keyword in search_keywords)

def process_with_search(llm, query: str, chat_history: List) -> str:
    """Process query with web search if needed"""
    # System prompt for better formatting
    system_prompt = """You are a helpful AI assistant. When responding:

1. **Use Markdown formatting** for better readability:
   - Use **bold** for important terms
   - Use `code` for technical terms, commands, or file names
   - Use headers (##) to organize long responses
   - Use bullet points or numbered lists for multiple items
   - Use tables for comparing information
   - Use code blocks with language tags for code examples

2. **Structure your responses**:
   - Start with a brief, direct answer
   - Then provide detailed explanation if needed
   - Use examples when helpful
   - Break down complex topics into sections

3. **Be conversational but professional**:
   - Use emojis occasionally (✅ ❌ 🎯 💡 🚀) for visual appeal
   - Be friendly and encouraging
   - Acknowledge the user's context

4. **For code examples**:
   - Always specify the language in code blocks
   - Add brief comments explaining key parts
   - Provide complete, working examples

5. **When using search results**:
   - Synthesize information clearly
   - Cite sources naturally
   - Present information in an organized way"""

    # Check if search is needed
    if should_search(query):
        # Perform search
        search_results = web_search_function(query)
        
        # Create enhanced prompt with search results
        enhanced_query = f"""{system_prompt}

Based on these search results, answer the user's question in a well-structured, formatted way:

{search_results}

User Question: {query}

Provide a comprehensive, well-formatted answer using Markdown."""
        
        messages = chat_history + [HumanMessage(content=enhanced_query)]
    else:
        messages = [SystemMessage(content=system_prompt)] + chat_history + [HumanMessage(content=query)]
    
    # Get LLM response
    response = llm.invoke(messages)
    return response.content

# -----------------------
# Session Management with Message History
# -----------------------
class SessionManager:
    def __init__(self):
        self.sessions: Dict[str, Dict] = {}
    
    def get_or_create_session(self, session_id: str, temperature: float = 0.7):
        """Get existing session or create new one"""
        if session_id not in self.sessions:
            # Check API key
            api_key = os.getenv("GROQ_API_KEY")
            if not api_key:
                raise ValueError("GROQ_API_KEY not found! Please set it in your .env file")
            
            # Initialize LLM
            llm = ChatGroq(
                model="openai/gpt-oss-120b",
                groq_api_key=api_key,
                temperature=temperature,
                max_tokens=2000
            )
            
            # Store session data
            self.sessions[session_id] = {
                "llm": llm,
                "chat_history": [],
                "created_at": datetime.now().isoformat()
            }
        
        return self.sessions[session_id]
    
    def add_message(self, session_id: str, role: str, content: str):
        """Add message to session history"""
        if session_id in self.sessions:
            if role == "user":
                self.sessions[session_id]["chat_history"].append(HumanMessage(content=content))
            elif role == "assistant":
                self.sessions[session_id]["chat_history"].append(AIMessage(content=content))
            elif role == "system":
                self.sessions[session_id]["chat_history"].append(SystemMessage(content=content))
    
    def get_history(self, session_id: str) -> List[Message]:
        """Get formatted chat history"""
        if session_id not in self.sessions:
            return []
        
        history = []
        for msg in self.sessions[session_id]["chat_history"]:
            if isinstance(msg, HumanMessage):
                history.append(Message(role="user", content=msg.content))
            elif isinstance(msg, AIMessage):
                history.append(Message(role="assistant", content=msg.content))
            elif isinstance(msg, SystemMessage):
                history.append(Message(role="system", content=msg.content))
        
        return history
    
    def clear_session(self, session_id: str):
        """Clear a specific session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
    
    def list_sessions(self):
        """List all active sessions"""
        return {
            sid: {
                "created_at": data["created_at"],
                "message_count": len(data["chat_history"])
            }
            for sid, data in self.sessions.items()
        }

session_manager = SessionManager()

# -----------------------
# API Endpoints
# -----------------------
@app.get("/", response_class=HTMLResponse)
async def root():
    """Web interface for testing"""
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>LangChain Chatbot</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/11.1.1/marked.min.js"></script>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            .container {
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 1000px;
                width: 100%;
                height: 85vh;
                display: flex;
                flex-direction: column;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px;
                border-radius: 20px 20px 0 0;
                text-align: center;
            }
            .header h1 {
                font-size: 28px;
                margin-bottom: 5px;
            }
            .header p {
                font-size: 14px;
                opacity: 0.9;
            }
            .chat-box {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #f8f9fa;
            }
            .message {
                margin: 15px 0;
                padding: 16px 20px;
                border-radius: 16px;
                max-width: 85%;
                animation: slideIn 0.3s ease;
                line-height: 1.6;
            }
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .user {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                margin-left: auto;
                border-bottom-right-radius: 4px;
            }
            .assistant {
                background: white;
                color: #2d3748;
                border: 1px solid #e2e8f0;
                border-bottom-left-radius: 4px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            
            /* Markdown Styling */
            .assistant h1, .assistant h2, .assistant h3 {
                margin-top: 20px;
                margin-bottom: 10px;
                font-weight: 600;
                color: #1a202c;
            }
            .assistant h1 { font-size: 1.8em; border-bottom: 2px solid #667eea; padding-bottom: 8px; }
            .assistant h2 { font-size: 1.5em; color: #667eea; }
            .assistant h3 { font-size: 1.2em; color: #764ba2; }
            .assistant p { margin: 12px 0; }
            .assistant ul, .assistant ol {
                margin: 12px 0;
                padding-left: 30px;
            }
            .assistant li {
                margin: 8px 0;
            }
            .assistant strong {
                color: #667eea;
                font-weight: 600;
            }
            .assistant em {
                color: #764ba2;
                font-style: italic;
            }
            .assistant code {
                background: #f7fafc;
                padding: 2px 6px;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 0.9em;
                color: #e53e3e;
                border: 1px solid #e2e8f0;
            }
            .assistant pre {
                background: #1a202c;
                padding: 16px;
                border-radius: 8px;
                overflow-x: auto;
                margin: 16px 0;
                border: 1px solid #2d3748;
            }
            .assistant pre code {
                background: transparent;
                padding: 0;
                border: none;
                color: #e2e8f0;
                font-size: 0.95em;
            }
            .assistant blockquote {
                border-left: 4px solid #667eea;
                padding-left: 16px;
                margin: 16px 0;
                color: #4a5568;
                font-style: italic;
                background: #f7fafc;
                padding: 12px 16px;
                border-radius: 4px;
            }
            .assistant table {
                border-collapse: collapse;
                width: 100%;
                margin: 16px 0;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .assistant th {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px;
                text-align: left;
                font-weight: 600;
            }
            .assistant td {
                padding: 12px;
                border-bottom: 1px solid #e2e8f0;
            }
            .assistant tr:last-child td {
                border-bottom: none;
            }
            .assistant tr:hover {
                background: #f7fafc;
            }
            .assistant a {
                color: #667eea;
                text-decoration: none;
                border-bottom: 1px solid #667eea;
            }
            .assistant a:hover {
                color: #764ba2;
                border-bottom-color: #764ba2;
            }
            .assistant hr {
                border: none;
                border-top: 2px solid #e2e8f0;
                margin: 20px 0;
            }
            
            .input-area {
                padding: 20px;
                border-top: 1px solid #e2e8f0;
                background: white;
                border-radius: 0 0 20px 20px;
            }
            .input-group {
                display: flex;
                gap: 10px;
            }
            input {
                flex: 1;
                padding: 15px;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                font-size: 16px;
                transition: all 0.3s;
            }
            input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }
            button {
                padding: 15px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 12px;
                cursor: pointer;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s;
            }
            button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
            }
            button:active {
                transform: translateY(0);
            }
            .clear-btn {
                background: #dc3545;
                padding: 15px 20px;
            }
            .clear-btn:hover {
                box-shadow: 0 5px 15px rgba(220, 53, 69, 0.4);
            }
            .typing {
                display: none;
                padding: 12px 16px;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                max-width: 75px;
                margin: 15px 0;
            }
            .typing.show { display: block; }
            .dot {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #667eea;
                margin: 0 2px;
                animation: bounce 1.4s infinite ease-in-out both;
            }
            .dot:nth-child(1) { animation-delay: -0.32s; }
            .dot:nth-child(2) { animation-delay: -0.16s; }
            @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }
            
            /* Copy button for code blocks */
            .code-block-wrapper {
                position: relative;
            }
            .copy-btn {
                position: absolute;
                top: 8px;
                right: 8px;
                padding: 6px 12px;
                font-size: 12px;
                background: #4a5568;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                opacity: 0.8;
            }
            .copy-btn:hover {
                opacity: 1;
                transform: none;
                box-shadow: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🤖 AI Chat Assistant</h1>
                <p>Powered by LangChain & Groq | Web Search Enabled</p>
            </div>
            <div id="chat-box" class="chat-box">
                <div class="message assistant">
                    <strong>👋 Hello! I'm your AI assistant.</strong><br><br>
                    I can help you with:
                    <ul>
                        <li><strong>Web Search</strong> - Find latest information from the internet</li>
                        <li><strong>Code Examples</strong> - Get formatted code snippets with syntax highlighting</li>
                        <li><strong>Detailed Explanations</strong> - Structured responses with tables, lists, and formatting</li>
                        <li><strong>Conversation Memory</strong> - I remember our entire conversation</li>
                    </ul>
                    Ask me anything! 🚀
                </div>
            </div>
            <div class="typing">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
            <div class="input-area">
                <div class="input-group">
                    <input type="text" id="message-input" placeholder="Type your message..." onkeypress="if(event.key==='Enter') sendMessage()">
                    <button onclick="sendMessage()">Send</button>
                    <button class="clear-btn" onclick="clearChat()">Clear</button>
                </div>
            </div>
        </div>

        <script>
            let sessionId = 'web-session-' + Date.now();
            
            // Configure marked for better rendering
            marked.setOptions({
                breaks: true,
                gfm: true,
                highlight: function(code, lang) {
                    if (lang && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(code, { language: lang }).value;
                        } catch (e) {}
                    }
                    return hljs.highlightAuto(code).value;
                }
            });

            async function sendMessage() {
                const input = document.getElementById('message-input');
                const message = input.value.trim();
                if (!message) return;

                addMessage('user', message, false);
                input.value = '';
                
                const typing = document.querySelector('.typing');
                typing.classList.add('show');

                try {
                    const response = await fetch('/v1/chat/completions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            messages: [{ role: 'user', content: message }],
                            session_id: sessionId,
                            use_search: true
                        })
                    });

                    typing.classList.remove('show');
                    
                    if (response.ok) {
                        const data = await response.json();
                        const assistantMessage = data.choices[0].message.content;
                        addMessage('assistant', assistantMessage, true);
                    } else {
                        const error = await response.json();
                        addMessage('assistant', '❌ Error: ' + (error.detail || 'Unknown error'), false);
                    }
                } catch (error) {
                    typing.classList.remove('show');
                    addMessage('assistant', '❌ Connection Error: ' + error.message, false);
                }
            }

            function addMessage(role, content, isMarkdown) {
                const chatBox = document.getElementById('chat-box');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message ' + role;
                
                if (isMarkdown && role === 'assistant') {
                    // Parse markdown
                    const htmlContent = marked.parse(content);
                    messageDiv.innerHTML = htmlContent;
                    
                    // Highlight code blocks
                    messageDiv.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightElement(block);
                        
                        // Add copy button
                        const wrapper = document.createElement('div');
                        wrapper.className = 'code-block-wrapper';
                        block.parentElement.parentNode.insertBefore(wrapper, block.parentElement);
                        wrapper.appendChild(block.parentElement);
                        
                        const copyBtn = document.createElement('button');
                        copyBtn.className = 'copy-btn';
                        copyBtn.textContent = 'Copy';
                        copyBtn.onclick = function() {
                            navigator.clipboard.writeText(block.textContent);
                            copyBtn.textContent = 'Copied!';
                            setTimeout(() => copyBtn.textContent = 'Copy', 2000);
                        };
                        wrapper.appendChild(copyBtn);
                    });
                } else {
                    messageDiv.textContent = content;
                }
                
                chatBox.appendChild(messageDiv);
                chatBox.scrollTop = chatBox.scrollHeight;
            }

            function clearChat() {
                const chatBox = document.getElementById('chat-box');
                chatBox.innerHTML = '<div class="message assistant"><strong>👋 Chat cleared!</strong><br>Start a new conversation.</div>';
                sessionId = 'web-session-' + Date.now();
            }
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/v1/chat/completions", response_model=ChatResponse)
async def chat_completions(request: ChatRequest):
    """OpenAI-compatible chat completions endpoint"""
    try:
        if not request.messages:
            raise HTTPException(status_code=400, detail="Messages list cannot be empty")
        
        last_message = request.messages[-1]
        if last_message.role != "user":
            raise HTTPException(status_code=400, detail="Last message must be from user")
        
        # Get or create session
        try:
            session = session_manager.get_or_create_session(
                session_id=request.session_id,
                temperature=request.temperature
            )
        except ValueError as e:
            raise HTTPException(status_code=500, detail=str(e))
        
        # Process with search if enabled
        try:
            if request.use_search:
                output_text = process_with_search(
                    session["llm"],
                    last_message.content,
                    session["chat_history"]
                )
            else:
                messages = session["chat_history"] + [HumanMessage(content=last_message.content)]
                response = session["llm"].invoke(messages)
                output_text = response.content
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"LLM Error: {str(e)}")
        
        # Add to history
        session_manager.add_message(request.session_id, "user", last_message.content)
        session_manager.add_message(request.session_id, "assistant", output_text)
        
        return ChatResponse(
            id=f"chatcmpl-{uuid.uuid4().hex[:8]}",
            created=int(datetime.now().timestamp()),
            model=request.model,
            session_id=request.session_id,
            choices=[{
                "index": 0,
                "message": {"role": "assistant", "content": output_text},
                "finish_reason": "stop"
            }],
            usage={
                "prompt_tokens": len(last_message.content.split()),
                "completion_tokens": len(output_text.split()),
                "total_tokens": len(last_message.content.split()) + len(output_text.split())
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_detail = f"Error: {str(e)}\n\nTraceback:\n{traceback.format_exc()}"
        raise HTTPException(status_code=500, detail=error_detail)

@app.get("/v1/sessions/{session_id}/history", response_model=SessionHistoryResponse)
async def get_session_history(session_id: str):
    """Get chat history for a session"""
    history = session_manager.get_history(session_id)
    return SessionHistoryResponse(
        session_id=session_id,
        messages=history,
        total_messages=len(history)
    )

@app.get("/v1/sessions")
async def list_sessions():
    """List all active sessions"""
    return {
        "sessions": session_manager.list_sessions(),
        "total": len(session_manager.sessions)
    }

@app.delete("/v1/sessions/{session_id}")
async def clear_session(session_id: str):
    """Clear a session"""
    session_manager.clear_session(session_id)
    return {"status": "success", "message": f"Session {session_id} cleared"}

@app.get("/v1/models")
async def list_models():
    """List available models"""
    return {
        "object": "list",
        "data": [
            {"id": "openai/gpt-oss-120b", "object": "model", "owned_by": "groq"},
            {"id": "openai/gpt-oss-120b", "object": "model", "owned_by": "groq"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)