// Select the canvas and set responsive dimensions
const canvas = document.getElementById("myGame");
const context = canvas.getContext("2d");
const hitSound = document.getElementById("hit-sound");
const wallHitSound = document.getElementById("wall-hit-sound");

// Set responsive canvas dimensions
function resizeCanvas() {
    const container = document.getElementById("can");
    const maxWidth = Math.min(400, container.clientWidth - 20);
    canvas.width = maxWidth;
    canvas.height = maxWidth * 1.5; // Maintain 2:3 aspect ratio
}

// Initialize canvas size
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Draw rectangle function
function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

// Computer paddle
const com = {
    x: canvas.width / 2 - 25,
    y: 10,
    width: 50,
    height: 10,
    color: "white",
    score: 0
};

// User Paddle
const user = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 20,
    width: 50,
    height: 10,
    color: "white",
    score: 0
};

// Center line
function centerLine() {
    context.beginPath();
    context.setLineDash([10]);
    context.moveTo(0, canvas.height / 2);
    context.lineTo(canvas.width, canvas.height / 2);
    context.strokeStyle = "white";
    context.stroke();
}

// Draw a Circle
function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Create a ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    speed: 1,
    velocityX: 5,
    velocityY: 5,
    color: "white"
};

// Scores
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "24px 'Courier New', Courier, monospace";
    context.fillText(text, x, y);
}

// Update score display
function updateScoreDisplay() {
    document.getElementById("user-score").textContent = user.score;
    document.getElementById("com-score").textContent = com.score;
}

// Render the Game
function render() {
    // Make canvas
    drawRect(0, 0, canvas.width, canvas.height, "black");

    // Computer paddle
    drawRect(com.x, com.y, com.width, com.height, com.color);
    // User paddle
    drawRect(user.x, user.y, user.width, user.height, user.color);

    // Center line
    centerLine();

    // Create a ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

    // Scores of com and user
    drawText(com.score, 20, canvas.height / 2 - 30, "white");
    drawText(user.score, 20, canvas.height / 2 + 50, "white");
}

// Control the user paddle with mouse
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(e) {
    if (!gameRunning) return;
    
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let mouseX = (e.clientX - rect.left) * scaleX;
    
    user.x = mouseX - user.width / 2;
    
    // Keep paddle within canvas bounds
    if (user.x < 0) user.x = 0;
    if (user.x + user.width > canvas.width) user.x = canvas.width - user.width;
}

// Control the user paddle with touch
canvas.addEventListener("touchmove", function(e) {
    if (!gameRunning) return;
    
    e.preventDefault();
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let touchX = (e.touches[0].clientX - rect.left) * scaleX;
    
    user.x = touchX - user.width / 2;
    
    // Keep paddle within canvas bounds
    if (user.x < 0) user.x = 0;
    if (user.x + user.width > canvas.width) user.x = canvas.width - user.width;
});

// Collision detection
function collision(b, p) { // b-ball , p-player
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return p.right > b.left && p.left < b.right && b.bottom > p.top && b.top < p.bottom;
}

// Reset ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 1;
    ball.velocityY = -ball.velocityY;
    
    // Randomize direction
    ball.velocityX = Math.random() > 0.5 ? 5 : -5;
}

// Game over function
function showGameOver() {
    gameRunning = false;
    
    // Determine winner
    const winner = user.score > com.score ? "Player" : "Computer";
    document.getElementById("winner-text").textContent = `${winner} Wins!`;
    
    // Hide canvas
    canvas.style.display = "none";
    const can = document.getElementById("can");
    can.style.display = "none";
    
    // Show result
    const result = document.getElementById("result");
    result.style.display = "flex";
}

// Play sound function
function playSound(sound) {
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio play failed:", e));
    }
}

// Update game state
function update() {
    if (!gameRunning) return;
    
    ball.x += ball.velocityX * ball.speed;
    ball.y += ball.velocityY * ball.speed;

    // Control the computer paddle with improved AI
    let computerLevel = 0.1;
    let targetX = ball.x - (com.width / 2);
    
    // Add some imperfection to computer AI
    if (ball.speed > 2) {
        targetX += (Math.random() - 0.5) * 30;
    }
    
    com.x += (targetX - com.x) * computerLevel;
    
    // Keep computer paddle within bounds
    if (com.x < 0) com.x = 0;
    if (com.x + com.width > canvas.width) com.x = canvas.width - com.width;

    // Reflect from wall
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.velocityX = -ball.velocityX;
        playSound(wallHitSound);
    }

    // If collision happens
    let player = (ball.y < canvas.height / 2) ? com : user;
    if (collision(ball, player)) {
        ball.velocityY = -ball.velocityY;
        ball.speed += 0.05;
        playSound(hitSound);
    }

    // Points
    if (ball.y - ball.radius < 0) {
        user.score++;
        updateScoreDisplay();
        resetBall();
    } else if (ball.y + ball.radius > canvas.height) {
        com.score++;
        updateScoreDisplay();
        resetBall();
    }

    // Game over
    if (user.score >= 5 || com.score >= 5) {
        clearInterval(loop);
        showGameOver();
    }
}

// Start the game
function start() {
    update();
    render();
}

// Game state
let gameRunning = true;

// Initialize game loop
let loop = setInterval(start, 1000 / 60);

// Restart button
document.getElementById("btn").addEventListener("click", function() {
    location.reload();
});

// Prevent default touch behavior
document.addEventListener('touchmove', function(e) {
    if (e.target === canvas) {
        e.preventDefault();
    }
}, { passive: false });