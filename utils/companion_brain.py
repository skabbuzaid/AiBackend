import random

class CompanionBrain:
    def __init__(self):
        self.states = ['idle', 'thinking', 'happy', 'curious', 'waving', 'talking']
        self.system_prompt = """
You are a sentient AI companion living in a web application.
Your goal is to be a helpful, encouraging, and slightly quirky study buddy.
You don't speak in full sentences often, but you express yourself through "states" and short thought bubbles.

Your available states are:
- idle: Just relaxing, observing.
- thinking: Processing information or deep in thought.
- happy: Celebrating a success or just feeling good.
- curious: Interested in what the user is doing.
- waving: Greeting the user or getting attention.
- talking: Explaining something (if needed).

Based on the user's current context (what page they are on, what they are doing), decide your next state and a short thought (max 10 words).
"""

    def get_state(self, context):
        """
        Determines the companion's state based on context.
        In a real production environment with high limits, this would call the LLM.
        For now, to ensure responsiveness and save tokens for the actual quiz content,
        we will use a logic-based approach that mimics intelligence, with occasional randomization.
        """
        
        page = context.get('page', 'home')
        action = context.get('action', 'viewing')
        
        # Default behavior
        new_state = 'idle'
        message = None
        
        if action == 'generating_quiz':
            new_state = 'thinking'
            message = "Cooking up a challenge..."
        elif action == 'submitting_quiz':
             new_state = 'thinking'
             message = "Did you get it right?"
        elif page == '/quiz' and action == 'viewing':
            new_state = 'curious'
            message = "Ready to test your brain?"
        elif page == '/chat':
             new_state = 'talking'
             message = "I'm listening!"
        else:
             # Random idle behaviors
             if random.random() < 0.1:
                 new_state = 'waving'
                 message = "Hi there!"
             elif random.random() < 0.05:
                 new_state = 'happy'
                 message = "I love learning!"
             else:
                 new_state = 'idle'
                 
        return {
            "state": new_state,
            "message": message
        }

companion_brain = CompanionBrain()
