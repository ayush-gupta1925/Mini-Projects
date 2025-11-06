// Game state
let score = {
    win: 0,
    loss: 0,
    tie: 0
};

// Load score from localStorage
function loadScore() {
    const savedScore = localStorage.getItem('cricketGameScore');
    if (savedScore) {
        score = JSON.parse(savedScore);
        updateScoreDisplay();
    }
}

// Save score to localStorage
function saveScore() {
    localStorage.setItem('cricketGameScore', JSON.stringify(score));
}

// Update score display
function updateScoreDisplay() {
    document.getElementById('win-count').textContent = score.win;
    document.getElementById('loss-count').textContent = score.loss;
    document.getElementById('tie-count').textContent = score.tie;
}

// Generate computer choice
function generateComputerChoice() {
    const randomNumber = Math.random() * 3;
    if (randomNumber <= 1) {
        return 'Bat';
    } else if (randomNumber <= 2) {
        return 'Ball';
    } else {
        return 'Stump';
    }
}

// Get game result
function getResult(userMove, computerMove) {
    if (userMove === computerMove) {
        score.tie++;
        return "It's a Tie! 🤝";
    }

    if (userMove === 'Bat') {
        if (computerMove === 'Ball') {
            score.win++;
            return "You Win! 🎉 Bat hits Ball!";
        } else {
            score.loss++;
            return "Computer Wins! 💻 Stump catches Bat!";
        }
    } else if (userMove === 'Ball') {
        if (computerMove === 'Stump') {
            score.win++;
            return "You Win! 🎉 Ball hits Stump!";
        } else {
            score.loss++;
            return "Computer Wins! 💻 Bat hits Ball!";
        }
    } else if (userMove === 'Stump') {
        if (computerMove === 'Bat') {
            score.win++;
            return "You Win! 🎉 Stump catches Bat!";
        } else {
            score.loss++;
            return "Computer Wins! 💻 Ball hits Stump!";
        }
    }
}

// Show result in UI
function showResult(userMove, computerMove, result) {
    // Update user choice display
    const userChoiceElement = document.getElementById('user-choice');
    userChoiceElement.innerHTML = `
        <div class="choice-display-item">
            <span class="choice-emoji">${getChoiceEmoji(userMove)}</span>
            <span class="choice-name">${userMove}</span>
        </div>
    `;

    // Update computer choice display
    const computerChoiceElement = document.getElementById('computer-choice');
    computerChoiceElement.innerHTML = `
        <div class="choice-display-item">
            <span class="choice-emoji">${getChoiceEmoji(computerMove)}</span>
            <span class="choice-name">${computerMove}</span>
        </div>
    `;

    // Update result display
    const resultElement = document.getElementById('game-result');
    resultElement.textContent = result;
    
    // Add bounce animation
    userChoiceElement.classList.add('bounce');
    computerChoiceElement.classList.add('bounce');
    resultElement.classList.add('bounce');
    
    // Remove animation after it completes
    setTimeout(() => {
        userChoiceElement.classList.remove('bounce');
        computerChoiceElement.classList.remove('bounce');
        resultElement.classList.remove('bounce');
    }, 600);

    // Update score display
    updateScoreDisplay();
    
    // Save score
    saveScore();
}

// Get emoji for choice
function getChoiceEmoji(choice) {
    switch (choice) {
        case 'Bat': return '🏏';
        case 'Ball': return '🎾';
        case 'Stump': return '🎯';
        default: return '❓';
    }
}

// Play game
function playGame(userMove) {
    const computerMove = generateComputerChoice();
    const result = getResult(userMove, computerMove);
    showResult(userMove, computerMove, result);
}

// Clear score
function clearScore() {
    score = { win: 0, loss: 0, tie: 0 };
    updateScoreDisplay();
    saveScore();
    
    // Reset displays
    document.getElementById('user-choice').innerHTML = '<span class="placeholder">-</span>';
    document.getElementById('computer-choice').innerHTML = '<span class="placeholder">-</span>';
    document.getElementById('game-result').innerHTML = '<span class="placeholder">-</span>';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load saved score
    loadScore();
    
    // Add click events to choice cards
    const choiceCards = document.querySelectorAll('.choice-card');
    choiceCards.forEach(card => {
        card.addEventListener('click', function() {
            const userChoice = this.getAttribute('data-choice');
            playGame(userChoice);
        });
    });
    
    // Add click event to clear button
    document.getElementById('clear-score').addEventListener('click', clearScore);
    
    // Add keyboard support
    document.addEventListener('keydown', function(event) {
        switch(event.key.toLowerCase()) {
            case 'b':
                playGame('Bat');
                break;
            case 'o':
                playGame('Ball');
                break;
            case 's':
                playGame('Stump');
                break;
            case 'c':
                clearScore();
                break;
        }
    });
});

// Additional CSS for choice display items
const style = document.createElement('style');
style.textContent = `
    .choice-display-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
    }
    
    .choice-emoji {
        font-size: 1.5rem;
    }
    
    .choice-name {
        font-size: 1rem;
        font-weight: bold;
    }
`;
document.head.appendChild(style);