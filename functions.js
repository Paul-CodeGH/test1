import { ctx, canvas } from "./game.js";
import global from "./globals.js";
import { character } from "./createCharacter.js";
export function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


export function updateScoreDisplay() {
    const scoreDiv = document.getElementById('score');
    scoreDiv.innerText = "Food eaten: " + global.score;
}

export function endGame() {
    clear();
    const gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.style.display = 'none';
    const scoreDiv = document.getElementById('score');
    scoreDiv.style.display = 'none';

    // Show the main menu
    const EndScreen = document.getElementById('EndScreen');
    EndScreen.style.display = 'flex';
    const resetButton = document.getElementById('restartButton');
    resetButton.addEventListener('click', () => {
        location.reload();
    });
}

export function updateCamera() {
    // Adjust camera to always center the character on the screen and scroll background accordingly
    global.cameraX = character.x - canvas.width / 2 + character.width / 2;
}



