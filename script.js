// --- DOM ELEMENTS ---
const arena = document.getElementById('arena');
const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const leaderboardList = document.getElementById('leaderboardList');

// --- GAME VARIABLES ---
let score = 0;
let timeLeft = 30;
let gameInterval;

// --- INITIALIZE ---
// Load the leaderboard as soon as the page opens
renderLeaderboard();

// --- GAME LOGIC ---

function moveTarget() {
    // Get max dimensions so the box doesn't spawn outside the arena
    const maxX = arena.clientWidth - target.clientWidth;
    const maxY = arena.clientHeight - target.clientHeight;

    // Generate random X and Y coordinates
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    // Apply new coordinates
    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
}

// When the target is clicked
target.addEventListener('click', () => {
    score++;
    scoreDisplay.innerText = score;
    moveTarget();
});

function startGame() {
    // Reset stats
    score = 0;
    timeLeft = 30;
    scoreDisplay.innerText = score;
    timerDisplay.innerText = timeLeft;
    
    // Update UI
    startBtn.disabled = true;
    target.style.display = 'block';
    
    moveTarget();

    // Start Timer Loop
    gameInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    // Stop game visually
    clearInterval(gameInterval);
    target.style.display = 'none';
    startBtn.disabled = false;

    // Prompt for username, fallback to Anonymous if left blank
    let playerName = prompt(`Time's up! You scored ${score}. Enter your name:`);
    if (!playerName) {
        playerName = "Anonymous";
    }

    saveToLeaderboard(playerName, score);
}

// --- LEADERBOARD LOGIC ---

function saveToLeaderboard(name, finalScore) {
    // Pull existing data, or create an empty array if none exists
    let leaderboard = JSON.parse(localStorage.getItem('aimLeaderboard')) || [];

    // Add new score
    leaderboard.push({ name: name, score: finalScore });

    // Sort by highest score first
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only the Top 10
    leaderboard = leaderboard.slice(0, 10);

    // Save back to local storage
    localStorage.setItem('aimLeaderboard', JSON.stringify(leaderboard));

    // Update the visual list on the screen
    renderLeaderboard();
}

function renderLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('aimLeaderboard')) || [];
    
    // Clear current list
    leaderboardList.innerHTML = ""; 

    // Inject each score as a list item
    leaderboard.forEach(entry => {
        let listItem = document.createElement('li');
        listItem.innerText = `${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(listItem);
    });
}

// Wire up the start button
startBtn.addEventListener('click', startGame);
