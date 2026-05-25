const arena = document.getElementById('arena');
const target = document.getElementById('target');
const decoys = document.querySelectorAll('.decoy');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const clearBtn = document.getElementById('clear-btn');
const leaderboardList = document.getElementById('leaderboardList');

let score = 0;
let timeLeft = 10.0; 
let timeBonus = 1.0; 
let gameInterval;

// Load the leaderboard immediately
renderLeaderboard();

function moveElement(element) {
    const maxX = arena.clientWidth - element.clientWidth;
    const maxY = arena.clientHeight - element.clientHeight;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    element.style.left = `${randomX}px`;
    element.style.top = `${randomY}px`;
}

function randomizePositions() {
    moveElement(target);
    decoys.forEach(decoy => moveElement(decoy));
}

// Click Good Target
target.addEventListener('click', () => {
    score++;
    scoreDisplay.innerText = score;
    
    timeLeft += timeBonus;
    timeBonus = timeBonus * 0.9; 
    timerDisplay.innerText = timeLeft.toFixed(1); 
    
    randomizePositions();
});

// Click Bad Decoy
decoys.forEach(decoy => {
    decoy.addEventListener('click', () => {
        score--;
        scoreDisplay.innerText = score;
        randomizePositions();
    });
});

function startGame() {
    score = 0;
    timeLeft = 10.0;
    timeBonus = 1.0; 
    scoreDisplay.innerText = score;
    timerDisplay.innerText = timeLeft.toFixed(1);
    
    startBtn.disabled = true;
    target.style.display = 'block';
    decoys.forEach(decoy => decoy.style.display = 'block');
    
    randomizePositions();

    gameInterval = setInterval(() => {
        timeLeft -= 0.1;
        timerDisplay.innerText = Math.max(0, timeLeft).toFixed(1);

        if (timeLeft <= 0) endGame();
    }, 100); 
}

function endGame() {
    clearInterval(gameInterval);
    target.style.display = 'none';
    decoys.forEach(decoy => decoy.style.display = 'none');
    startBtn.disabled = false;

    let playerName = prompt(`Time's up! You scored ${score}. Enter your name:`);
    if (!playerName) playerName = "Anonymous";

    saveToLeaderboard(playerName, score);
}

function saveToLeaderboard(name, finalScore) {
    let leaderboard = JSON.parse(localStorage.getItem('aimLeaderboard')) || [];
    leaderboard.push({ name: name, score: finalScore });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('aimLeaderboard', JSON.stringify(leaderboard));
    renderLeaderboard();
}

function renderLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('aimLeaderboard')) || [];
    leaderboardList.innerHTML = ""; 
    leaderboard.forEach(entry => {
        let listItem = document.createElement('li');
        listItem.innerText = `${entry.name}: ${entry.score}`;
        leaderboardList.appendChild(listItem);
    });
}

// Clear Leaderboard with Passcode
clearBtn.addEventListener('click', () => {
    let passcode = prompt("Enter the 5-digit admin code to clear the leaderboard:");
    if (passcode === "95801") {
        localStorage.removeItem('aimLeaderboard');
        renderLeaderboard();
        alert("Success: Leaderboard has been wiped.");
    } else if (passcode !== null) {
        alert("Incorrect code. The leaderboard is safe.");
    }
});

startBtn.addEventListener('click', startGame);
