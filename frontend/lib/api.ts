import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export const createSession = async (): Promise<string> => {
  if (typeof window !== 'undefined' && localStorage.getItem('eduai_session_id')) {
    return localStorage.getItem('eduai_session_id') as string;
  }
  const response = await api.post('/session');
  const newSessionId = response.data.session_id;
  if (typeof window !== 'undefined') {
    localStorage.setItem('eduai_session_id', newSessionId);
  }
  return newSessionId;
};

export const sendMessage = async (message: string, sessionId: string, history: ChatMessage[]) => {
  // Convert history to format expected by backend if needed, or just send last message context
  // Backend expects: messages: List[Message], session_id: str
  // And Message is { role: str, content: str }

  // We need to send the FULL history or just the new message?
  // Backend `chat` endpoint takes `messages: List[Message]`.
  // And `last_msg = request.messages[-1].content`.
  // So it seems we should send the conversation so far + new message.

  const payload = {
    messages: [...history, { role: 'user', content: message }],
    session_id: sessionId
  };

  const response = await api.post('/chat', payload);
  return response.data;
};

export const getChatHistory = async (sessionId: string) => {
  const response = await api.get(`/chat/history/${sessionId}`);
  return response.data.history;
};

export const generateQuiz = async (topic: string, difficulty: string, numQuestions: number, sessionId: string) => {
  const response = await api.post('/quiz/generate', {
    topic,
    difficulty,
    num_questions: numQuestions,
    session_id: sessionId
  });
  return response.data;
};

export const submitQuiz = async (quizId: string, answers: Record<string, string>, sessionId: string) => {
  const response = await api.post('/quiz/submit', {
    quiz_id: quizId,
    answers,
    session_id: sessionId
  });
  return response.data;
};

export const generateFlashcards = async (topic: string, numCards: number, sessionId: string) => {
  const response = await api.post('/flashcards/generate', {
    topic,
    num_cards: numCards,
    session_id: sessionId
  });
  return response.data;
};

export const getProgress = async (sessionId: string) => {
  const response = await api.get(`/progress/${sessionId}`);
  return response.data;
};

export const getChatSession = async (sessionId: string) => {
  // Placeholder for fetching session details if needed
  // For now, we can just return a mock or implement a real endpoint later
  return { id: sessionId, created_at: new Date().toISOString() };
};
