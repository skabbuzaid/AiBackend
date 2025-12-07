import re
import json

def extract_option_char(text):
    if not text: return ""
    # Original regex from routes.py
    match = re.match(r"^[\s\(]*([A-Da-d0-9])[\s\)\.]", text.strip())
    if match:
        return match.group(1).upper()
    clean = text.strip().upper()
    return clean if len(clean) == 1 else clean[:1]

def test_scoring_logic():
    print("Testing Scoring Logic...")

    # Mock Data based on User Report
    # Question: "In a simple harmonic oscillator..."
    # User Answer: "C) It quadruples"
    # Correct Answer: "C"
    
    user_answer_text = "C) It quadruples"
    correct_answer_text = "C"
    
    user_char = extract_option_char(user_answer_text)
    correct_char = extract_option_char(correct_answer_text)
    
    print(f"User Answer Raw: '{user_answer_text}' -> Extracted: '{user_char}'")
    print(f"Correct Answer Raw: '{correct_answer_text}' -> Extracted: '{correct_char}'")
    
    if user_char == correct_char:
        print("✅ Match Success: Answer marked correct")
    else:
        print("❌ Match Failed: Answer marked incorrect")

    # Test ID Mismatch Hypothesis
    print("\nTesting ID Mismatch...")
    quiz_questions = [{"id": 1, "question": "Q1"}, {"id": 2, "question": "Q2"}]
    submission_answers = {"1": "A", "2": "B"} # Keys are strings as they come from JSON
    
    score = 0
    for q in quiz_questions:
        q_id = q["id"] # This is int
        print(f"Processing Q ID: {q_id} (type: {type(q_id)})")
        
        # Simulating dict.get()
        # Direct access
        ans = submission_answers.get(q_id)
        if ans:
             print(f"  Found with int key: {ans}")
        else:
             print(f"  Not found with int key")
             
        # String access
        ans_str = submission_answers.get(str(q_id))
        if ans_str:
             print(f"  Found with str key: {ans_str}")
        else:
             print(f"  Not found with str key")

if __name__ == "__main__":
    test_scoring_logic()
