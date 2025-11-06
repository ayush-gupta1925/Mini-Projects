let userScore = 0;
let compScore = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");

const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");

const genCompChoice = () => {
  const options = ["rock", "paper", "scissors"];
  const randIdx = Math.floor(Math.random() * 3);
  return options[randIdx];
};

const drawGame = () => {
  msg.innerText = "Game was Draw. Play again.";
  msg.style.backgroundColor = "#081b31";
};

const showWinner = (userWin, userChoice, compChoice) => {
  if (userWin) {
    userScore++;
    userScorePara.innerText = userScore;
    msg.innerText = `You win! Your ${userChoice} beats ${compChoice}`;
    msg.style.backgroundColor = "green";
    
    // Add win animation to user score
    userScorePara.classList.add("win-animation");
    setTimeout(() => {
      userScorePara.classList.remove("win-animation");
    }, 500);
  } else {
    compScore++;
    compScorePara.innerText = compScore;
    msg.innerText = `You lost. ${compChoice} beats your ${userChoice}`;
    msg.style.backgroundColor = "red";
    
    // Add win animation to computer score
    compScorePara.classList.add("win-animation");
    setTimeout(() => {
      compScorePara.classList.remove("win-animation");
    }, 500);
  }
};

const playGame = (userChoice) => {
  // Play sound
  playSound();
  
  //Generate computer choice
  const compChoice = genCompChoice();

  if (userChoice === compChoice) {
    //Draw Game
    drawGame();
  } else {
    let userWin = true;
    if (userChoice === "rock") {
      //scissors, paper
      userWin = compChoice === "paper" ? false : true;
    } else if (userChoice === "paper") {
      //rock, scissors
      userWin = compChoice === "scissors" ? false : true;
    } else {
      //rock, paper
      userWin = compChoice === "rock" ? false : true;
    }
    showWinner(userWin, userChoice, compChoice);
  }
};

// Add click event listeners to choices
choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    const userChoice = choice.getAttribute("id");
    playGame(userChoice);
  });
});

// Sound function
function playSound() {
  const sound = document.getElementById("click-sound");
  if (sound) {
    sound.currentTime = 0; // Restart the sound if already playing
    sound.play().catch(e => {
      console.log("Audio play failed:", e);
    });
  }
}

// Add keyboard support for accessibility
document.addEventListener('keydown', (event) => {
  switch(event.key) {
    case 'r':
      playGame('rock');
      break;
    case 'p':
      playGame('paper');
      break;
    case 's':
      playGame('scissors');
      break;
  }
});