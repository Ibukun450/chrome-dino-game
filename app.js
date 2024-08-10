document.addEventListener('DOMContentLoaded', function() {
    const dino = document.querySelector('.dino');
    const grid = document.querySelector('.grid');
    let gravity = 0.9;
    const alert = document.getElementById('alert');
    let isJumping = false;
    let isGameOver = false;
    let movingbg = document.getElementById('desert');
    
    
    
    function control(e) {
        if (e.code === 'Space') {
            if (!isJumping) {
                jump();
            }
        }
    }

    document.addEventListener('touchstart', function() {
        if (!isJumping) {
            jump();
        }
    })
    document.addEventListener('click', function() {
        if (!isJumping) {
            jump();
        }
    })
    

    
    document.addEventListener('keydown', control);

    let position = 0;
    function jump() {
        isJumping = true;
        let count = 0;
        let timerId = setInterval(function() {
            if (count === 15) {
                clearInterval(timerId);
                let downTimerId = setInterval(() => {
                    if (count == 0) {
                        clearInterval(downTimerId);
                        isJumping = false;
                    }
                    position -= 5;
                    count--; 
                    position = position * gravity;
                    dino.style.bottom = position + 'px';
                }, 10);
            }

            position += 35;
            count++;
            position = position * gravity;
            dino.style.bottom = position + 'px';
        }, 20);
    }

    function generateObstacles() {
        if (!isGameOver) {
            let minTime = 500; // Minimum time interval
            let randomTime = Math.random() * 3000 + minTime; // Random time between minTime and 4000ms

            let obstacleTypes = ['largeCactus', 'largeCactus2', 'largeCactus3', 'smallCactus', 'smallCactus2', 'smallCactus3'];
            let randomObstacle = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
            
            createObstacle(randomObstacle);
    
            setTimeout(generateObstacles, randomTime);
        }
    }
    
    function createObstacle(className) {
        let obstaclePosition = 1000;
        const obstacle = document.createElement('div');
        obstacle.classList.add(className);
        grid.appendChild(obstacle);
        obstacle.style.left = obstaclePosition + 'px';
    
        let timerId = setInterval(function() {
            if (obstaclePosition > 0 && obstaclePosition < 60 && position < 60) {
                clearInterval(timerId);
                alert.style.opacity = '100%';
                movingbg.style.animationIterationCount = 0;
                isGameOver = true;
                stopTimer(); // Stop the timer when game is over
                updateHighScore(); // Update the high score in local storage
    
                while (grid.firstChild) {
                    grid.removeChild(grid.lastChild);
                }
            }
    
            obstaclePosition -= 10;
            obstacle.style.left = obstaclePosition + 'px';
        }, 20);
    }
    
    generateObstacles();
    startTimer(); // Start the timer when the game starts
    displayHighScore(); // Display the high score when the game starts
});

function rstFunc() {
    location.reload(); // This will reload the page to restart the game
}

let startTime;
let elapsedTime = 0;
let isRunning = false;
let timerId;

function startTimer() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        isRunning = true;
        timerId = requestAnimationFrame(updateTimer);
    }
}

function stopTimer() {
    if (isRunning) {
        cancelAnimationFrame(timerId);
        isRunning = false;
    }
}

function resetTimer() {
    cancelAnimationFrame(timerId);
    elapsedTime = 0;
    isRunning = false;
    displayTime(elapsedTime);
}

function updateTimer() {
    elapsedTime = Date.now() - startTime;
    displayTime(elapsedTime);
    timerId = requestAnimationFrame(updateTimer);
}

function displayTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    document.getElementById('timer').textContent = `${pad(minutes)}:${pad(seconds)}`;
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

function displayHighScore() {
    const highScore = localStorage.getItem('highScore');
    if (highScore) {
        document.getElementById('highScore').textContent = `${formatTime(highScore)}`;
    }
}

function updateHighScore() {
    const highScore = localStorage.getItem('highScore');
    if (!highScore || elapsedTime > highScore) {
        localStorage.setItem('highScore', elapsedTime);
        document.getElementById('highScore').textContent = `${formatTime(elapsedTime)}`;
    }
}

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `HT ${pad(minutes)}:${pad(seconds)}`;
}

// Automatically start the timer when the script loads
document.addEventListener('DOMContentLoaded', startTimer);

// Example of stopping and resetting the timer
document.getElementById('stopButton').addEventListener('click', stopTimer);
document.getElementById('resetButton').addEventListener('click', resetTimer);

// Function to handle game over
function gameOver() {
    stopTimer();
    alert("Game Over!");
}

// Example call to gameOver when game ends (you should replace this with your actual game over logic)
setTimeout(gameOver, 10000); // This is just a placeholder to simulate the game over condition
