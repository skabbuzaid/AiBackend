// --- STATE & CONFIG ---
const API_URL = 'http://127.0.0.1:8000/api';
let sessionId = localStorage.getItem('eduai_session');

// --- THEME ---
function toggleTheme() {
    const body = document.body;
    const current = body.getAttribute('data-theme');
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');

    if (current === 'light') {
        body.setAttribute('data-theme', 'dark');
        icon.className = 'ph ph-moon';
        text.innerText = 'Dark Mode';
        localStorage.setItem('eduai_theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        icon.className = 'ph ph-sun';
        text.innerText = 'Light Mode';
        localStorage.setItem('eduai_theme', 'light');
    }
}

// Load saved theme
const savedTheme = localStorage.getItem('eduai_theme');
if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');
    if (savedTheme === 'light') {
        icon.className = 'ph ph-sun';
        text.innerText = 'Light Mode';
    }
}

// --- INIT ---
async function init() {
    if (!sessionId) {
        try {
            const res = await fetch(`${API_URL}/session`, { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                sessionId = data.session_id;
                localStorage.setItem('eduai_session', sessionId);
            } else {
                console.error("Failed to create session");
            }
        } catch (e) {
            console.error("Error creating session:", e);
        }
    }

    if (sessionId) {
        fetchProgress();
        loadChatHistory();
    }
}
init();

async function loadChatHistory() {
    try {
        const res = await fetch(`${API_URL}/chat/history/${sessionId}`);
        if (res.ok) {
            const data = await res.json();
            const container = document.getElementById('chat-messages');
            // Clear default message if history exists
            if (data.history.length > 0) {
                container.innerHTML = '';
                data.history.forEach(msg => {
                    addMessage(msg.content, msg.role === 'user' ? 'user' : 'ai', false);
                });
                // Scroll to bottom
                const lastMsg = container.lastElementChild;
                if (lastMsg) lastMsg.scrollIntoView();
            }
        }
    } catch (e) {
        console.error("Error loading chat history:", e);
    }
}

// --- NAVIGATION ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// --- API CALLS ---
async function fetchProgress() {
    try {
        const res = await fetch(`${API_URL}/progress/${sessionId}`);
        const data = await res.json();

        document.getElementById('total-quizzes').innerText = data.total_quizzes;
        document.getElementById('avg-score').innerText = data.average_score + '%';
        document.getElementById('streak').innerText = data.learning_streak;

        // Update Charts (Mock for now, real data integration later)
        // renderChart(data.recent_quizzes); 
    } catch (e) { console.error(e); }
}

// --- CHAT ---
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';

    try {
        const res = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ role: 'user', content: text }], session_id: sessionId })
        });
        const data = await res.json();
        addMessage(data.response, 'ai');
    } catch (e) {
        addMessage("Sorry, I encountered an error.", 'ai');
    }
}

function addMessage(text, role, scroll = true) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.innerHTML = marked.parse(text);
    document.getElementById('chat-messages').appendChild(div);
    if (scroll) {
        div.scrollIntoView({ behavior: 'smooth' });
    }
    hljs.highlightAll();
}

function handleChatKey(e) { if (e.key === 'Enter') sendMessage(); }

// --- QUIZZES ---
async function createQuiz() {
    const topic = document.getElementById('quiz-topic').value;
    const diff = document.getElementById('quiz-difficulty').value;
    const count = document.getElementById('quiz-count').value;

    closeModal('quiz-modal');
    // Show loading state...

    try {
        const res = await fetch(`${API_URL}/quiz/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, difficulty: diff, num_questions: count, session_id: sessionId })
        });
        const data = await res.json();
        startQuiz(data);
        fetchProgress(); // Update stats
    } catch (e) { alert('Error generating quiz'); }
}

function startQuiz(quizData) {
    const modal = document.getElementById('take-quiz-modal');
    const container = document.getElementById('quiz-interface');

    let html = `<h2>${quizData.title}</h2><form id="quiz-form">`;
    quizData.questions.forEach((q, i) => {
        html += `
            <div style="margin-bottom: 1.5rem; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
                <p style="font-weight: 600; margin-bottom: 0.5rem;">${i + 1}. ${q.question}</p>
                ${q.options.map(opt => `
                    <label style="display: block; padding: 0.5rem; cursor: pointer;">
                        <input type="radio" name="q${q.id}" value="${opt.charAt(0)}"> ${opt}
                    </label>
                `).join('')}
            </div>
        `;
    });
    html += `<button type="button" class="btn btn-primary" onclick="submitQuiz('${quizData.quiz_id}')">Submit Quiz</button></form>`;

    container.innerHTML = html;
    openModal('take-quiz-modal');
}

async function submitQuiz(quizId) {
    const form = document.getElementById('quiz-form');
    const formData = new FormData(form);
    const answers = {};

    // Extract answers (simplified)
    // In a real app, we'd iterate through questions to get IDs properly
    // For now, assuming we can get them from the form data keys
    for (const [key, value] of formData.entries()) {
        const qId = key.substring(1); // remove 'q' prefix
        answers[qId] = value;
    }

    try {
        const res = await fetch(`${API_URL}/quiz/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quiz_id: quizId, answers, session_id: sessionId })
        });
        const result = await res.json();

        alert(`Quiz Completed! Score: ${result.score}%`);
        closeModal('take-quiz-modal');
        fetchProgress();
    } catch (e) { alert('Error submitting quiz'); }
}

// --- FLASHCARDS ---
async function createFlashcards() {
    const topic = document.getElementById('flash-topic').value;
    const count = document.getElementById('flash-count').value;

    closeModal('flashcard-modal');

    try {
        const res = await fetch(`${API_URL}/flashcards/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, num_cards: count, session_id: sessionId })
        });
        const data = await res.json();
        alert(`Generated ${data.cards.length} flashcards for ${data.topic}! (View implementation coming soon)`);
        fetchProgress();
    } catch (e) { alert('Error generating flashcards'); }
}
