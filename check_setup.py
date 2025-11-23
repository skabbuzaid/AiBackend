#!/usr/bin/env python3
"""
Setup Checker - Verify all requirements before running the server
"""
import os
import sys
from pathlib import Path

def print_header(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60)

def check_env_file():
    """Check if .env file exists and has GROQ_API_KEY"""
    print_header("Checking .env File")
    
    env_file = Path(".env")
    if not env_file.exists():
        print("❌ .env file NOT FOUND!")
        print("\n📝 Create a .env file with:")
        print("   GROQ_API_KEY=your_groq_api_key_here")
        print("\n🔑 Get your key from: https://console.groq.com/keys")
        return False
    
    print("✅ .env file exists")
    
    # Check if GROQ_API_KEY is set
    with open(".env", "r") as f:
        content = f.read()
        if "GROQ_API_KEY" in content:
            # Try to load it
            from dotenv import load_dotenv
            load_dotenv()
            api_key = os.getenv("GROQ_API_KEY")
            
            if api_key and len(api_key) > 10:
                print(f"✅ GROQ_API_KEY found: {api_key[:10]}...{api_key[-4:]}")
                return True
            else:
                print("❌ GROQ_API_KEY is empty or invalid")
                return False
        else:
            print("❌ GROQ_API_KEY not found in .env file")
            print("\n📝 Add this line to your .env file:")
            print("   GROQ_API_KEY=your_groq_api_key_here")
            return False

def check_dependencies():
    """Check if all required packages are installed"""
    print_header("Checking Dependencies")
    
    required = {
        "fastapi": "FastAPI",
        "uvicorn": "Uvicorn",
        "dotenv": "python-dotenv",
        "duckduckgo_search": "duckduckgo-search",
        "langchain_groq": "langchain-groq",
        "langchain_core": "langchain-core",
        "pydantic": "pydantic"
    }
    
    missing = []
    
    for module, package in required.items():
        try:
            __import__(module)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - NOT INSTALLED")
            missing.append(package)
    
    if missing:
        print(f"\n❌ Missing {len(missing)} package(s)")
        print("\n📦 Install missing packages:")
        print(f"   pip install {' '.join(missing)}")
        return False
    
    print(f"\n✅ All {len(required)} packages installed!")
    return True

def test_groq_connection():
    """Test if Groq API key works"""
    print_header("Testing Groq Connection")
    
    try:
        from langchain_groq import ChatGroq
        from dotenv import load_dotenv
        
        load_dotenv()
        api_key = os.getenv("GROQ_API_KEY")
        
        if not api_key:
            print("❌ GROQ_API_KEY not set")
            return False
        
        print("🔄 Testing connection to Groq...")
        
        llm = ChatGroq(
            model="openai/gpt-oss-120b",
            groq_api_key=api_key,
            temperature=0.7
        )
        
        response = llm.invoke("Say 'Hello' in one word")
        print(f"✅ Connection successful!")
        print(f"   Response: {response.content[:50]}")
        return True
        
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        print("\n🔍 Possible issues:")
        print("   1. Invalid API key")
        print("   2. Network connection problem")
        print("   3. Groq service is down")
        return False

def test_search():
    """Test DuckDuckGo search"""
    print_header("Testing Web Search")
    
    try:
        from duckduckgo_search import DDGS
        
        print("🔄 Testing search...")
        results = DDGS().text("test", max_results=1)
        
        if results:
            print("✅ Search working!")
            return True
        else:
            print("⚠️  Search returned no results (might be rate limited)")
            return True  # Still OK
            
    except Exception as e:
        print(f"❌ Search failed: {str(e)}")
        return False

def main():
    print("\n" + "🔍 LANGCHAIN CHATBOT SETUP CHECKER".center(60))
    print("="*60)
    
    checks = [
        ("Environment File", check_env_file),
        ("Dependencies", check_dependencies),
        ("Groq Connection", test_groq_connection),
        ("Web Search", test_search)
    ]
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n❌ Unexpected error in {name}: {str(e)}")
            results.append((name, False))
    
    # Summary
    print_header("Summary")
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
    
    print(f"\n{'='*60}")
    if passed == total:
        print("✅ ALL CHECKS PASSED! You're ready to run the server!")
        print("\n🚀 Start the server with:")
        print("   uvicorn main:app --reload")
    else:
        print(f"❌ {total - passed} check(s) failed. Please fix the issues above.")
        print("\n📚 Need help? Check INSTALLATION.md")
    print("="*60 + "\n")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)