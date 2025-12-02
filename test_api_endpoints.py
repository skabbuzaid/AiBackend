import requests
import json
import sys

BASE_URL = "http://localhost:8000/api"

def test_endpoints():
    print("Testing API Endpoints...")
    
    # 1. Health
    try:
        resp = requests.get(f"{BASE_URL}/health")
        print(f"Health: {resp.status_code} - {resp.json()}")
        if resp.status_code != 200:
            print("Health check failed!")
            return
    except Exception as e:
        print(f"Health check error: {e}")
        return

    # 2. Create Session
    try:
        resp = requests.post(f"{BASE_URL}/session")
        print(f"Session: {resp.status_code} - {resp.json()}")
        session_id = resp.json().get("session_id")
        if not session_id:
            print("Failed to get session_id")
            return
    except Exception as e:
        print(f"Session creation error: {e}")
        return

    # 3. Chat
    try:
        payload = {
            "messages": [{"role": "user", "content": "Hello, who are you?"}],
            "session_id": session_id
        }
        resp = requests.post(f"{BASE_URL}/chat", json=payload)
        print(f"Chat: {resp.status_code}")
        if resp.status_code == 200:
            print(f"Chat Response: {resp.json().get('response')[:50]}...")
        else:
            print(f"Chat Error: {resp.text}")
    except Exception as e:
        print(f"Chat error: {e}")

    # 4. Generate Quiz
    try:
        payload = {
            "topic": "Python",
            "difficulty": "easy",
            "num_questions": 3,
            "session_id": session_id
        }
        resp = requests.post(f"{BASE_URL}/quiz/generate", json=payload)
        print(f"Quiz Gen: {resp.status_code}")
        if resp.status_code == 200:
            quiz_data = resp.json()
            quiz_id = quiz_data.get("quiz_id")
            print(f"Quiz ID: {quiz_id}")
            
            # 5. Submit Quiz
            if quiz_id:
                submit_payload = {
                    "quiz_id": quiz_id,
                    "answers": {"1": "A"},
                    "session_id": session_id
                }
                resp = requests.post(f"{BASE_URL}/quiz/submit", json=submit_payload)
                print(f"Quiz Submit: {resp.status_code} - Score: {resp.json().get('score')}")
        else:
            print(f"Quiz Gen Error: {resp.text}")
    except Exception as e:
        print(f"Quiz error: {e}")

    # 6. Generate Flashcards
    try:
        payload = {
            "topic": "Space",
            "num_cards": 3,
            "session_id": session_id
        }
        resp = requests.post(f"{BASE_URL}/flashcards/generate", json=payload)
        print(f"Flashcards: {resp.status_code}")
        if resp.status_code != 200:
            print(f"Flashcards Error: {resp.text}")
    except Exception as e:
        print(f"Flashcards error: {e}")

if __name__ == "__main__":
    test_endpoints()
