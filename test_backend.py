import requests
import uuid
import json

BASE_URL = "http://127.0.0.1:8000"

def test_endpoints():
    print(f"Testing API at {BASE_URL}...")
    
    # 1. Health
    try:
        res = requests.get(f"{BASE_URL}/api/health")
        print(f"Health: {res.status_code} - {res.json()}")
    except Exception as e:
        print(f"Health Check Failed: {e}")
        return

    # 2. Session
    try:
        res = requests.post(f"{BASE_URL}/api/session")
        if res.status_code == 200:
            session_id = res.json()["session_id"]
            print(f"Session Created: {session_id}")
        else:
            print(f"Session Creation Failed: {res.text}")
            return
    except Exception as e:
        print(f"Session Error: {e}")
        return

    # 3. Chat
    try:
        payload = {
            "messages": [{"role": "user", "content": "Hello"}],
            "session_id": session_id
        }
        res = requests.post(f"{BASE_URL}/api/chat", json=payload)
        if res.status_code == 200:
            print(f"Chat Response: {res.json()['response'][:50]}...")
        else:
            print(f"Chat Failed: {res.text}")
    except Exception as e:
        print(f"Chat Error: {e}")

    # 4. Quiz Generate
    quiz_id = None
    try:
        payload = {
            "topic": "Python",
            "difficulty": "easy",
            "num_questions": 1,
            "session_id": session_id
        }
        res = requests.post(f"{BASE_URL}/api/quiz/generate", json=payload)
        if res.status_code == 200:
            data = res.json()
            quiz_id = data.get("quiz_id")
            print(f"Quiz Generated: {quiz_id}")
        else:
            print(f"Quiz Gen Failed: {res.text}")
    except Exception as e:
        print(f"Quiz Gen Error: {e}")

    # 5. Quiz Submit
    if quiz_id:
        try:
            payload = {
                "quiz_id": quiz_id,
                "answers": {"1": "A"},
                "session_id": session_id
            }
            res = requests.post(f"{BASE_URL}/api/quiz/submit", json=payload)
            if res.status_code == 200:
                print(f"Quiz Submitted: Score {res.json()['score']}")
            else:
                print(f"Quiz Submit Failed: {res.text}")
        except Exception as e:
            print(f"Quiz Submit Error: {e}")

    # 6. Flashcards Generate
    try:
        payload = {
            "topic": "Python",
            "num_cards": 3,
            "session_id": session_id
        }
        res = requests.post(f"{BASE_URL}/api/flashcards/generate", json=payload)
        if res.status_code == 200:
            print(f"Flashcards Generated: {len(res.json()['cards'])} cards")
        else:
            print(f"Flashcard Gen Failed: {res.text}")
    except Exception as e:
        print(f"Flashcard Gen Error: {e}")

    # 7. Progress
    try:
        res = requests.get(f"{BASE_URL}/api/progress/{session_id}")
        if res.status_code == 200:
            print(f"Progress: {res.json()}")
        else:
            print(f"Progress Failed: {res.text}")
    except Exception as e:
        print(f"Progress Error: {e}")

if __name__ == "__main__":
    test_endpoints()
