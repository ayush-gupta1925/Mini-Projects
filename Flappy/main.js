const hole = document.getElementById("hole");
const result = document.getElementById("result");
const text = document.getElementById("text");
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score-display");
const restartBtn = document.getElementById("btn");

let jumping = 0;
let score = 0;
let gameRunning = true;

// Create touch controls for mobile
function createTouchControls() {
  const touchControls = document.createElement("div");
  touchControls.className = "touch-controls";
  
  const jumpButton = document.createElement("div");
  jumpButton.className = "touch-button";
  jumpButton.textContent = "↑";
  jumpButton.addEventListener("touchstart", jump);
  jumpButton.addEventListener("mousedown", jump);
  
  touchControls.appendChild(jumpButton);
  document.body.appendChild(touchControls);
}

// Animation for hole movement
hole.addEventListener("animationiteration", hol);

function hol() {
  if (!gameRunning) return;
  
  const random = -((Math.random() * 350) + 150);
  hole.style.top = random + "px";
  score++;
  scoreDisplay.textContent = `Score: ${score}`;
}

// Game loop - check for collisions
const fall = setInterval(function() {
  if (!gameRunning) return;
  
  const bird = document.getElementById("bird");
  const block = document.getElementById("block");
  
  const birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
  
  // Apply gravity if not jumping
  if (jumping === 0) {
    bird.style.top = (birdTop + 2) + "px";
  }

  const blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue("left"));
  const holeTop = parseInt(window.getComputedStyle(hole).getPropertyValue("top"));
  const hTop = (500 + holeTop);
  
  // Collision detection
  const birdHitTop = birdTop <= 0;
  const birdHitBottom = birdTop >= 450;
  const birdInPipeRange = blockLeft < 50 && blockLeft > -50;
  const birdHitPipe = birdInPipeRange && (birdTop < hTop || birdTop > hTop + 100);
  
  if (birdHitTop || birdHitBottom || birdHitPipe) {
    gameOver();
  }
}, 15);

// Jump function
function jump() {
  if (!gameRunning) return;
  
  jumping = 1;
  
  const bird = document.getElementById("bird");
  const birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue("top"));
  
  if (birdTop > 6) {
    bird.style.top = (birdTop - 60) + "px";
    // Add jump animation
    bird.style.transform = "rotate(-20deg)";
  }

  // Play jump sound
  const sound = document.getElementById("jump-sound");
  sound.currentTime = 0;
  sound.play().catch(e => console.log("Audio play failed:", e));

  setTimeout(function() {
    jumping = 0;
    // Reset rotation
    bird.style.transform = "rotate(0deg)";
  }, 100);
}

// Game over function
function gameOver() {
  gameRunning = false;
  result.style.display = "block";
  text.innerText = `Final Score: ${score}`;
  game.style.opacity = "0.7";
}

// Restart game
restartBtn.addEventListener("click", function() {
  location.reload();
});

// Event listeners for keyboard and touch
window.addEventListener("keydown", function(e) {
  if (e.code === "Space" || e.key === " " || e.key === "ArrowUp") {
    e.preventDefault();
    jump();
  }
});

// Initialize touch controls for mobile
createTouchControls();

// Prevent context menu on long press
document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});