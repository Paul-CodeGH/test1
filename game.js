import { Food } from './Food.js';
import { FakeObject } from './FakeObject.js';
import { Damage } from './DamagingObstacle.js';
import { EndLevelObjectNL } from './EndLevelObjects.js';
import { MapObjectsNC } from './MapObjectsView.js';
import { TrapObjects } from './TrapObjectsFall.js';
import { BaseGameObject } from './BaseObject.js';
import { Background } from './Background.js';
import { clear, updateScoreDisplay, endGame, updateCamera } from './functions.js';
import { InteractiveObjectsClass } from './InteractiveObjects.js';
import { fakeBreak, trampolineJumping, backgroundMusic, teleportSound } from './sounds.js';
import global from './globals.js';
import { character } from './createCharacter.js';
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('Controls').addEventListener('click' , () => {
    document.getElementById('Controls').style.display = 'none';
    document.getElementById('controlsModal').style.display = 'flex';
});

document.getElementById('controlsModal').addEventListener('click', () => {
    document.getElementById('controlsModal').style.display = 'none';
    document.getElementById('Controls').style.display = 'block';
})





export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');
export let obstacles = [];
export let endLevelObject = [];
export let backgroundImage = [];  
export let isOnGround = false;
export let trapObjects = [];
export let foods = [];
export let fakeObject = [];
export let damageObjects = [];
export let mapObjects = [];
export let interactiveObjects = [];



document.addEventListener('keydown', (e) => {
    global.keysPressed[e.key] = true; // Mark the key as pressed

    // Handle jump
    if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && isOnGround) {
        character.dy = -15; // Adjust jump strength as needed
        isOnGround = false;
    }
});

document.addEventListener('keyup', (e) => {
    delete global.keysPressed[e.key]; // Remove the key from pressed keys
});

// Update character movement based on active keys
function updateCharacterMovement() {
    if (global.keysPressed['ArrowRight'] || global.keysPressed['d'] || global.keysPressed['D']) {
        character.dx = character.speed;
    } else if (global.keysPressed['ArrowLeft'] || global.keysPressed['a'] || global.keysPressed['A']) {
        character.dx = -character.speed;
    } else {
        character.dx = 0; // Stop horizontal movement if neither key is pressed
    }
}



function gameLoop(timestamp) {
    // Calculate deltaTime for the current frame
    const deltaTime = (timestamp - global.lastTime) / 1000;
    global.lastTime = timestamp;

    clear(ctx);
    updateCharacterMovement();
    
    backgroundImage.forEach(background => background.drawBackground(ctx));
    
    character.moveCharacter(character);
    character.applyGravity();
    character.drawCharacter(ctx);
    character.updateAnimation();
    character.updateCharacterSize(global.score);
    console.log(character.width, character.height);
    interactiveObjects.forEach(interactiveObject => interactiveObject.drawBaseGameObject(ctx));
    interactiveObjects.forEach(interactiveObject => interactiveObject.checkMovementReset());
    interactiveObjects.forEach(interactiveObject => interactiveObject.displayMoveDistance());
    obstacles.forEach(obstacle => obstacle.drawBaseGameObject(ctx));
    endLevelObject.forEach(endLevelObj => endLevelObj.drawLevelEndObject(ctx));
    mapObjects.forEach(mapObject => mapObject.drawMapObjects(ctx));
    trapObjects.forEach(trap => trap.drawTrapObjects(ctx));
    foods.forEach(food => food.drawFood(ctx));
    fakeObject.forEach(fake => fake.drawFakeObject(ctx));
    damageObjects.forEach(damageOb => damageOb.drawDamagingObstacle(ctx));

    checkCollisions();
    foods.forEach(food => {
        if (food.checkCollisions(character)) {
            global.score += 1;
            updateScoreDisplay();
        }
    });
    fakeObject.forEach(fake => fake.checkCollisions(character));
    damageObjects.forEach(damageOb => damageOb.checkCollisions(character));

    updateCamera();

    requestAnimationFrame(gameLoop);
}









function startGame() {
    document.getElementById('mainMenu').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    const scoreDiv = document.getElementById('score');
    scoreDiv.style.display = 'block';
    // Check if backgroundMusic is already playing
    if (backgroundMusic.paused) {
        backgroundMusic.play();
    } else {
        backgroundMusic.currentTime = 0;
    }
    loadLevel(global.currentLevel);
    requestAnimationFrame(gameLoop);
}

export function loadLevel(level) {
    interactiveObjects.forEach(interactiveObject => interactiveObject.reset());
    character.x = 50;
    character.y = 550;
    global.cameraX = 0; // Reset camera position
    if (level === 0) {
        obstacles = [
            new BaseGameObject(0, 880, 4000, 10, './imgs/terrain1.jpg'),
            new BaseGameObject(200, 700, 150, 180, './imgs/ciupearca.png'), 
            new BaseGameObject(700, 380, 550, 500, './imgs/hamsterwheel.png'),
            new BaseGameObject(2240, 480, 550, 400, './imgs/hamsterhouse.png'),           
        ];

        interactiveObjects = [
            new InteractiveObjectsClass(1700, 680, 200, 200, './imgs/boxNoBG.png', 400),
        ]
        endLevelObject = [
            new EndLevelObjectNL(3100, 500, 400, 400, './imgs/portalfinalNoBG.png'),
        ];
        mapObjects = [
            new MapObjectsNC(1100, 100, 1300, 900, './imgs/waterbottle.png'),
        ];
        trapObjects = [
        ];
        foods = [
            new Food(400, 600, 100, 100, './imgs/apple.png'),
            new Food(500, 600, 100, 100, './imgs/apple.png'),
            new Food(600, 600, 100, 100, './imgs/apple.png'),
            new Food(1000, 200, 100, 100, './imgs/pizzaNoBG.png'),
            new Food(2900, 650, 100, 100, './imgs/pizzaNoBG.png'),
            
        ];
        fakeObject = [
            //new FakeObject(600, 1000, 50, 50, './hamster.png'),
            //new FakeObject(720, 1000, 50, 50, './hamster.png')
        ];
        
        damageObjects = [
            new Damage(500, 745, 150, 150, './imgs/ball.png'),
        ];
        
        
        
        console.log(foods);
        backgroundImage = [
            new Background('./imgs/cage.png'),
        ];
        
        
    } else if (level === 1) {
        mapObjects = [];
        obstacles = [
            new BaseGameObject(0, 1050, 8000, 50, './imgs/Wood.jpg'),
            new BaseGameObject(1100, 600, 75, 450, './imgs/book1.png'),
            new BaseGameObject(1000, 700, 75, 350, './imgs/book3.png'),
            new BaseGameObject(1500, 0, 75, 890, './imgs/Wood.jpg'), // Long Bar left
            new BaseGameObject(2100, 250, 75, 800, './imgs/Wood.jpg'), // Long Bar Right
            new BaseGameObject(1575, 790, 175, 100, './imgs/Wood.jpg'),
            new BaseGameObject(1930, 950, 175, 100, './imgs/Wood.jpg'),
            new BaseGameObject(1575, 400, 175, 100, './imgs/Wood.jpg'), // Platform to jump left
            new BaseGameObject(1930, 600, 175, 100, './imgs/Wood.jpg'), // Platform To Jump Right


            // Tunnel Objects
            new BaseGameObject(2175, 250, 600, 100, './imgs/Wood.jpg'),
            new BaseGameObject(2975, 250, 600, 100, './imgs/Wood.jpg'),
            new BaseGameObject(3575, 0, 100, 350, './imgs/Wood.jpg'),

            // Under the tunnel object
            new BaseGameObject(3150, 555, 200, 500, './imgs/book4.png'),
            new BaseGameObject(3350, 555, 200, 80, './imgs/book4.png'),
            new BaseGameObject(3750, 555, 500, 80, './imgs/book4.png'),
            new BaseGameObject(4250, 855, 50, 200, './imgs/book4.png'),

            // The Game At the end
            new BaseGameObject(5000, 855, 200, 200, './imgs/rubikNoBG.png'),
            new BaseGameObject(5600, 655, 200, 200, './imgs/rubikNoBG.png'),
            new BaseGameObject(5600, 255, 200, 200, './imgs/rubikNoBG.png'),
        ];
        foods = [
            new Food(800, 900, 100, 100, './imgs/pizzaNoBG.png'),
            new Food(1600, 200, 100, 100, './imgs/pizzaNoBG.png'),
            new Food(2200, 900, 100, 100, './imgs/pizzaNoBG.png'),
            new Food(3400, 100, 100, 100, './imgs/pizzaNoBG.png'),
            new Food(3400, 900, 100, 100, './imgs/pizzaNoBG.png'),
            new Food(5700, 100, 100, 100, './imgs/pizzaNoBG.png'),
        ]

        fakeObject = [
            new FakeObject(3550, 555, 200, 80, './imgs/book4.png'),
            new FakeObject(4250, 555, 50, 300, './imgs/blackBlock.png'),
        ]

        trapObjects = [
            //new TrapObjects(2775, 250, 200, 100, '/imgs/blackBlock.png'),//Tunnel,
        ];
        endLevelObject = [
            new EndLevelObjectNL(6300, 650, 200, 400, './imgs/portalfinalNoBG.png'),
        ]

        interactiveObjects = [
            new InteractiveObjectsClass(400, 850, 200, 200, './imgs/rubikNoBG.png', 400),
            new InteractiveObjectsClass(5000, 655, 200, 200, './imgs/rubikNoBG.png', 400),
            new InteractiveObjectsClass(5600, 855, 200, 200, './imgs/rubikNoBG.png', 400),
            new InteractiveObjectsClass(5600, 455, 200, 200, './imgs/rubikNoBG.png', 400),
        ]

        damageObjects = [
            new Damage(2800, 870, 200, 200, './imgs/ball.png'),
        ];
        
        backgroundImage = [
            new Background('./imgs/backgroundlevel2.png'),
        ];
    } else if (level === 2) {
        mapObjects = [
            new MapObjectsNC(5500, 400, 400, 400, './imgs/jumpIMG.jpg'),
        ];
        obstacles = [
            // Trial at start
            new BaseGameObject(300, 900, 30, 150, './imgs/Wood.jpg'),
            new BaseGameObject(500, 800, 30, 250, './imgs/Wood.jpg'),
            new BaseGameObject(500, 0, 30, 500, './imgs/Wood.jpg'),
            new BaseGameObject(700, 0, 30, 700, './imgs/Wood.jpg'),
            new BaseGameObject(700, 930, 30, 120, './imgs/Wood.jpg'),
            new BaseGameObject(1000, 0, 30, 400, './imgs/Wood.jpg'),
            new BaseGameObject(1400, 630, 30, 470, './imgs/Wood.jpg'),
            new BaseGameObject(1430, 630, 300, 20, './imgs/Wood.jpg'),
            new BaseGameObject(1930, 630, 400, 20, './imgs/Wood.jpg'),
            new BaseGameObject(2330, 0 , 30, 650, './imgs/Wood.jpg'),





            new BaseGameObject(0, 1050, 5300, 50, './imgs/Wood.jpg'), // Platform to walk on


            new BaseGameObject(2800, 350, 400, 700, './imgs/Wood.jpg'), // Entry Wall
            new BaseGameObject(2800, 0, 400, 100, './imgs/Wood.jpg'), // Entry Wall

            new BaseGameObject(3200, 1000, 200, 50, './imgs/Wood.jpg'),
            new BaseGameObject(3400, 0, 200, 400, './imgs/Wood.jpg'),
            new BaseGameObject(3400, 650, 400, 400, './imgs/Wood.jpg'),
            new BaseGameObject(3600, 0, 200, 300, './imgs/Wood.jpg'),
            new BaseGameObject(3800, 0, 400, 300, './imgs/Wood.jpg'),
            new BaseGameObject(3800, 520, 400, 530, './imgs/Wood.jpg'),
            new BaseGameObject(4200, 0, 200, 300, './imgs/Wood.jpg'),

            new BaseGameObject(4400, 0, 900, 850, './imgs/Wood.jpg'),
            new BaseGameObject(5100, 850, 200, 200, './imgs/ventOBJ.png'),

        ];
        foods = [
            new Food(3250, 800, 100, 100, './imgs/pizzaNoBG.png'),
            new Food(4250, 900, 100, 100, './imgs/pizzaNoBG.png'),
            new Food(970, 400, 100, 100, '/imgs/pizzaNoBG.png'),
            new Food(1500, 950, 100, 100, './imgs/pizzaNoBG.png'),
        ];
        fakeObject = [
            new FakeObject(2800, 100, 200, 250, './imgs/ventOBJ.png'),

        ];
        trapObjects = [
            //new TrapObjects(1730, 630, 300, 20, './imgs/blackBlock.png'),

        ];
        endLevelObject = [
            new EndLevelObjectNL(4900, 890, 150, 150, './imgs/portalfinalNoBG.png'),
        ];
        interactiveObjects = [];
        damageObjects = [
            new Damage(2400, 870, 200, 200, './imgs/ball.png'),
            new Damage(2600, 730, 200, 200, './imgs/ball.png'),
            new Damage(3250, 910, 100, 100, './imgs/ball.png'),
            new Damage(1100, 960, 100, 100, './imgs/ball.png'),
        ];
        backgroundImage = [
            new Background('/imgs/3rdLevelBlack.png'),
        ];
    }   
}




function nextLevel() {
    if (global.currentLevel < global.totalLevels - 1) {
        global.currentLevel++;
        loadLevel(global.currentLevel);
    } else {
        endGame();
    }
}


///// Checking for collisions, but only for those where the character is affected as well
function checkCollisions() {
    obstacles.forEach(obstacle => {
    // Horizontal collision detection (left and right edges)
    if (
        character.y < obstacle.y + obstacle.height && // Character is within the vertical bounds of the obstacle
        character.y + character.height > obstacle.y &&
        Math.abs(character.y + character.height - obstacle.y) > 1 // Skip if standing on top
    ) {
        if (
            character.x + character.width > obstacle.x && // Character's right edge overlaps obstacle's left edge
            character.x < obstacle.x // Character's left edge is to the left of the obstacle
        ) {
            // Collision from the left side
            character.x = obstacle.x - character.width; // Align with the left edge
            character.dx = 0; // Stop horizontal movement
        } else if (
            character.x < obstacle.x + obstacle.width && // Character's left edge overlaps obstacle's right edge
            character.x + character.width > obstacle.x + obstacle.width // Character's right edge is to the right of the obstacle
        ) {
            // Collision from the right side
            character.x = obstacle.x + obstacle.width; // Align with the right edge
            character.dx = 0; // Stop horizontal movement
        }
    }
    
    // Vertical collision detection (top and bottom edges)
    if (
        character.x < obstacle.x + obstacle.width &&
        character.x + character.width > obstacle.x &&
        character.y + character.dy < obstacle.y + obstacle.height &&
        character.y + character.height + character.dy > obstacle.y
    ) {
        if (character.dy > 0) {
            // Falling: stop at the top edge of the obstacle (ground detection)
            character.y = obstacle.y - character.height;
            character.dy = 0; // Stop vertical movement
            isOnGround = true; // Set isOnGround to true when standing on an obstacle
        } else if (character.dy < 0) {
            // Jumping: stop at the bottom edge of the obstacle
            character.y = obstacle.y + obstacle.height;
            character.dy = 0; // Stop vertical movement
        }
    }
});

    interactiveObjects.forEach(interactiveObject => {
        // Horizontal collision detection
        if (
            character.y < interactiveObject.y + interactiveObject.height && // Character is within the vertical bounds of the obstacle
            character.y + character.height > interactiveObject.y &&
            Math.abs(character.y + character.height - interactiveObject.y) > 1 // Skip if standing on top
        ) {
            if (
                character.x + character.width > interactiveObject.x && // Character's right edge overlaps obstacle's left edge
                character.x < interactiveObject.x // Character's left edge is to the left of the obstacle
            ) {
                // Collision from the left side
                character.x = interactiveObject.x - character.width; // Align with the left edge
                character.dx = 0; // Stop horizontal movement
                // Move the interacrive object to the right side
                interactiveObject.x += 3;
            } else if (
                character.x < interactiveObject.x + interactiveObject.width && // Character's left edge overlaps obstacle's right edge
                character.x + character.width > interactiveObject.x + interactiveObject.width // Character's right edge is to the right of the obstacle
            ) {
                // Collision from the right side
                character.x = interactiveObject.x + interactiveObject.width; // Align with the right edge
                character.dx = 0; // Stop horizontal movement
                // Move the interactive object to the left side
                interactiveObject.x -= 3;
            }
        }
    
        // Vertical collision detection
        if (
            character.x < interactiveObject.x + interactiveObject.width &&
            character.x + character.width > interactiveObject.x &&
            character.y + character.dy < interactiveObject.y + interactiveObject.height &&
            character.y + character.height + character.dy > interactiveObject.y
        ) {
            if (character.dy > 0) {
                // Falling: stop at the top edge of the obstacle
                character.y = interactiveObject.y - character.height;
                character.dy = 0; // Stop vertical movement
                isOnGround = true; // Set isOnGround to true when standing on an obstacle
            } else if (character.dy < 0) {
                // Jumping: stop at the bottom edge of the obstacle
                character.y = interactiveObject.y + interactiveObject.height;
                character.dy = 0; // Stop vertical movement
            }
        }
    });
        
    

    trapObjects.forEach((trap, index) => {
        // Horizontal collision detection: The player is on top of the trap (and not falling through)
        if (
            character.x < trap.x + trap.width &&
            character.x + character.width > trap.x &&
            character.y + character.height >= trap.y &&
            character.y + character.height <= trap.y + trap.height + 5 // Allow a small margin
        ) {
            // The player is on top of the trap
            isOnGround = true;
            character.y = trap.y - character.height; // Ensure the player stays on top
    
            // Only add the keydown listener once, not repeatedly for every frame
            if (!trap.keyListenerAdded) {
                trap.keyListenerAdded = true; // Prevent adding multiple listeners
    
                // Listen for the down arrow key to remove the trap when the player is on top
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                        // Check if the player is still on top of the trap when pressing the down arrow key
                        if (
                            character.x < trap.x + trap.width &&
                            character.x + character.width > trap.x &&
                            character.y + character.height === trap.y
                        ) {
                            trapObjects.splice(index, 1); // Remove the trap object
                            // Check if fakeBreak is already playing
                            if (fakeBreak.paused) {
                                fakeBreak.play();
                            } else {
                                fakeBreak.currentTime = 0;
                            }
                        }
                    }
                });
            }
        }
    
        // Vertical collision detection: Stop player from falling through the trap
        if (
            character.x < trap.x + trap.width &&
            character.x + character.width > trap.x &&
            character.y + character.dy < trap.y + trap.height &&
            character.y + character.height + character.dy > trap.y
        ) {
            if (character.dy > 0) {
    
                character.y = trap.y - character.height;
                character.dy = 0;
                isOnGround = true;
            } else if (character.dy < 0) {
                
                character.y = trap.y + trap.height;
                character.dy = 0;
            }
        }
    });
    damageObjects.forEach(damageOb => {

        
        // Horizontal collision detection
        if (
            character.y < damageOb.y + damageOb.height && // Character is within the vertical bounds of the obstacle
            character.y + character.height > damageOb.y &&
            Math.abs(character.y + character.height - damageOb.y) > 1 // Skip if standing on top
        ) {
            if (
                character.x + character.width > damageOb.x && // Character's right edge overlaps obstacle's left edge
                character.x < damageOb.x // Character's left edge is to the left of the obstacle
            ) {
                // Collision from the left side
                character.x = damageOb.x - character.width; // Align with the left edge
                character.dx = 0; // Stop horizontal movement
            } else if (
                character.x < damageOb.x + damageOb.width && // Character's left edge overlaps obstacle's right edge
                character.x + character.width > damageOb.x + damageOb.width // Character's right edge is to the right of the obstacle
            ) {
                // Collision from the right side
                character.x = damageOb.x + damageOb.width; // Align with the right edge
                character.dx = 0; // Stop horizontal movement
            }
        }
    
        // Vertical collision detection
        if (
            character.x < damageOb.x + damageOb.width &&
            character.x + character.width > damageOb.x &&
            character.y + character.dy < damageOb.y + damageOb.height &&
            character.y + character.height + character.dy > damageOb.y
        ) {
            if (character.dy > 0) {
                // Falling: stop at the top edge of the obstacle
                character.y = damageOb.y - character.height;
                character.dy = -20; // Stop vertical movement
                // Check if trampolineJumping is already playing
                if (trampolineJumping.paused) {
                    trampolineJumping.play();
                } else {
                    trampolineJumping.currentTime = 0;
                }
                isOnGround = true; // Set isOnGround to true when standing on an obstacle
            } else if (character.dy < 0) {
                // Jumping: stop at the bottom edge of the obstacle
                character.y = damageOb.y + damageOb.height;
                character.dy = 0; // Stop vertical movement
            }
        }
    });
    

    endLevelObject.forEach(endLevelObj => {
        if (
            character.x < endLevelObj.x + endLevelObj.width &&
            character.x + character.width > endLevelObj.x &&
            character.y + character.height >= endLevelObj.y &&
            character.y + character.height <= endLevelObj.y + endLevelObj.height + 5 // Allow a small margin
        ) {
            // Check if teleportSound is already playing
            if (teleportSound.paused) {
                teleportSound.play();
            } else {
                teleportSound.currentTime = 0;
            }
            nextLevel();
        }
    });


    
}