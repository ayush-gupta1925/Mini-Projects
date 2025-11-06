// Game elements
var character = document.getElementById("character");
var result = document.getElementById("result");
var game = document.getElementById("dino-container");
var scoreDisplay = document.getElementById("score");
var countDisplay = document.getElementById("count");
var jumpSound = document.getElementById("sound");
var block = document.getElementById("block");
var jumpBtn = document.getElementById("jump-btn");

// Game variables
var count = 0;
var isJumping = false;
var gameRunning = true;
var gameSpeed = 1.5;

// Jump function
function jump() {
    if (!gameRunning || isJumping) return;
    
    isJumping = true;
    character.style.bottom = "100px";
    
    // Play jump sound
    playSound(jumpSound);
    
    setTimeout(function() {
        character.style.bottom = "20px";
        isJumping = false;
    }, 500);
    
    count++;
    countDisplay.textContent = count;
    
    // Increase game speed every 10 points
    if (count % 10 === 0) {
        gameSpeed += 0.1;
        block.style.animationDuration = (2 - gameSpeed * 0.1) + "s";
    }
}

// Play sound function
function playSound(sound) {
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(function(e) {
            console.log("Audio play failed:", e);
        });
    }
}

// Keyboard controls
window.addEventListener("keydown", function(e) {
    if (e.code === "Space" || e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        jump();
    }
});

// Touch controls for mobile
jumpBtn.addEventListener("click", jump);

// Also allow tapping anywhere on the game container to jump on mobile
game.addEventListener("click", function(e) {
    if (window.innerWidth <= 768) {
        jump();
    }
});

// Collision detection
function checkCollision() {
    var blockRect = block.getBoundingClientRect();
    var characterRect = character.getBoundingClientRect();
    
    return !(blockRect.right < characterRect.left || 
             blockRect.left > characterRect.right || 
             blockRect.bottom < characterRect.top || 
             blockRect.top > characterRect.bottom);
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    if (checkCollision()) {
        gameOver();
    }
    
    requestAnimationFrame(gameLoop);
}

// Game over function
function gameOver() {
    gameRunning = false;
    result.style.display = "flex";
    scoreDisplay.innerHTML = `Score: ${count}`;
    
    // Stop block animation
    block.style.animation = "none";
}

// Restart game
document.getElementById("btn").addEventListener("click", function() {
    location.reload();
});

// Show jump button on mobile devices
function checkMobile() {
    if (window.innerWidth <= 768) {
        jumpBtn.style.display = "block";
    } else {
        jumpBtn.style.display = "none";
    }
}

// Initialize game
checkMobile();
window.addEventListener("resize", checkMobile);

// Start game loop
gameLoop();

// Initialize block animation speed
block.style.animationDuration = gameSpeed + "s";