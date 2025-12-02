#!/usr/bin/env python3
"""
EduAI Platform Setup Script
Automatically sets up the complete learning platform
"""

import os
import sys
import subprocess
from pathlib import Path

def print_header(text):
    print("\n" + "="*70)
    print(f"  {text}")
    print("="*70 + "\n")

def print_step(step_num, text):
    print(f"\n[{step_num}/7] {text}")
    print("-" * 70)

def run_command(cmd, shell=True):
    """Run a command and return success status"""
    try:
        subprocess.run(cmd, shell=shell, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        return False

def create_directory_structure():
    """Create project directories"""
    dirs = [
        "static",
        "models",
        "utils",
        "data",
        "logs"
    ]
    
    for dir_name in dirs:
        Path(dir_name).mkdir(exist_ok=True)
        print(f"✅ Created directory: {dir_name}/")
    
    return True

def create_env_file():
    """Create .env template"""
    env_content = """# EduAI Platform Configuration

# Required API Keys
GROQ_API_KEY=your_groq_api_key_here

# Optional API Keys  
HUGGINGFACE_API_KEY=your_huggingface_token_here

# Database (Optional, for production)
# DATABASE_URL=postgresql://user:pass@localhost/eduai

# Redis (Optional, for caching)
# REDIS_URL=redis://localhost:6379

# App Settings
DEBUG=True
SECRET_KEY=your-secret-key-change-this-in-production
MAX_QUIZ_QUESTIONS=20
MAX_FLASHCARDS=50

# Model Settings
DEFAULT_MODEL=groq
DEFAULT_TEMPERATURE=0.7
MAX_TOKENS=2000
"""
    
    if not Path(".env").exists():
        with open(".env", "w") as f:
            f.write(env_content)
        print("✅ Created .env file")
        print("⚠️  Please edit .env and add your API keys!")
    else:
        print("ℹ️  .env file already exists")
    
    return True

def install_dependencies():
    """Install Python dependencies"""
    print("Installing dependencies...")
    
    if run_command(f"{sys.executable} -m pip install --upgrade pip"):
        print("✅ pip upgraded")
    else:
        print("⚠️  pip upgrade failed")
    
    if run_command(f"{sys.executable} -m pip install -r requirements.txt"):
        print("✅ All dependencies installed")
        return True
    else:
        print("❌ Dependency installation failed")
        return False

def create_static_files():
    """Create basic static HTML files"""
    
    # index.html (dashboard) already created in artifacts
    
    # Create simple chat.html
    chat_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Tutor - EduAI</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/11.1.1/marked.min.js"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 2rem;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        h1 { color: white; margin-bottom: 2rem; }
    </style>
</head>
<body>
    <div class="container">
        <h1>💬 AI Tutor Chat</h1>
        <div id="chat-messages" style="min-height: 400px;"></div>
        <input type="text" id="chat-input" placeholder="Ask me anything..." style="width: 100%; padding: 1rem; border-radius: 12px; border: none; font-size: 1rem;">
        <button onclick="sendMessage()" style="margin-top: 1rem; padding: 1rem 2rem; background: white; color: #667eea; border: none; border-radius: 12px; cursor: pointer; font-weight: 600;">Send</button>
    </div>
    <script>
        async function sendMessage() {
            const input = document.getElementById('chat-input');
            const message = input.value.trim();
            if (!message) return;
            
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    messages: [{role: 'user', content: message}],
                    session_id: 'user-' + Date.now()
                })
            });
            
            const data = await response.json();
            alert(data.response);
            input.value = '';
        }
    </script>
</body>
</html>"""
    
    with open("static/chat.html", "w") as f:
        f.write(chat_html)
    
    print("✅ Created static files")
    return True

def check_api_keys():
    """Check if API keys are configured"""
    from dotenv import load_dotenv
    load_dotenv()
    
    groq_key = os.getenv("GROQ_API_KEY")
    hf_key = os.getenv("HUGGINGFACE_API_KEY")
    
    if groq_key and groq_key != "your_groq_api_key_here":
        print("✅ Groq API key configured")
        return True
    else:
        print("⚠️  Groq API key not configured")
        print("   Get your key from: https://console.groq.com/keys")
        print("   Edit .env and add: GROQ_API_KEY=gsk_your_key_here")
        return False

def run_tests():
    """Run basic tests"""
    print("Running basic tests...")
    
    try:
        # Test imports
        import fastapi
        import langchain_groq
        from duckduckgo_search import DDGS
        
        print("✅ All imports successful")
        return True
    except ImportError as e:
        print(f"❌ Import failed: {e}")
        return False

def main():
    print_header("🎓 EduAI Platform Setup")
    print("This script will set up your complete AI learning platform")
    print("Estimated time: 2-3 minutes\n")
    
    input("Press Enter to continue...")
    
    # Step 1: Create directories
    print_step(1, "Creating Directory Structure")
    if not create_directory_structure():
        print("❌ Setup failed at directory creation")
        return
    
    # Step 2: Create .env file
    print_step(2, "Creating Configuration Files")
    create_env_file()
    
    # Step 3: Install dependencies
    print_step(3, "Installing Dependencies (this may take a few minutes)")
    if not install_dependencies():
        print("❌ Setup failed at dependency installation")
        return
    
    # Step 4: Create static files
    print_step(4, "Creating Static Files")
    create_static_files()
    
    # Step 5: Check API keys
    print_step(5, "Checking API Keys")
    keys_ok = check_api_keys()
    
    # Step 6: Run tests
    print_step(6, "Running Tests")
    tests_ok = run_tests()
    
    # Step 7: Final summary
    print_step(7, "Setup Complete!")
    
    print("\n" + "="*70)
    print("📋 SETUP SUMMARY")
    print("="*70)
    print(f"✅ Directory structure created")
    print(f"✅ Configuration files created")
    print(f"✅ Dependencies installed")
    print(f"✅ Static files created")
    print(f"{'✅' if keys_ok else '⚠️ '} API keys {'configured' if keys_ok else 'need configuration'}")
    print(f"{'✅' if tests_ok else '❌'} Tests {'passed' if tests_ok else 'failed'}")
    
    print("\n" + "="*70)
    print("🚀 NEXT STEPS")
    print("="*70)
    
    if not keys_ok:
        print("\n1. ⚠️  IMPORTANT: Configure your API keys in .env file")
        print("   - Get Groq key: https://console.groq.com/keys")
        print("   - Edit .env and add your key")
    else:
        print("\n1. ✅ API keys are configured!")
    
    print("\n2. 🚀 Start the server:")
    print("   uvicorn main:app --reload")
    
    print("\n3. 🌐 Open your browser:")
    print("   http://localhost:8000")
    
    print("\n4. 📚 Read the documentation:")
    print("   Check README.md for detailed usage")
    
    print("\n" + "="*70)
    print("💡 QUICK TEST:")
    print("="*70)
    print("curl http://localhost:8000/api/health")
    print("="*70 + "\n")
    
    if keys_ok and tests_ok:
        print("✨ All systems ready! Your learning platform is set up.")
    else:
        print("⚠️  Some configuration needed. Please complete the steps above.")
    
    print("\n🎉 Happy Learning!")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Setup interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Setup failed with error: {e}")
        sys.exit(1)