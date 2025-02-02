import { ctx, canvas, isOnGround } from './game.js';
import { obstacles, interactiveObjects, trapObjects, damageObjects, endLevelObject } from './game.js';
import global from './globals.js';

export class Character {
    constructor(x, y, width, height, speed, spriteSrc, spriteWidth, spriteHeight, totalFrames, columnsnumber, rowsnumber) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.dx = 0;
        this.dy = 0;
        this.image = new Image();
        this.image.src = spriteSrc;

        // Spritesheet properties
        this.spriteWidth = spriteWidth; 
        this.spriteHeight = spriteHeight; 
        this.totalFrames = totalFrames; 
        this.currentFrame = 0; 
        this.frameDelay = 10; 
        this.frameCounter = 0; 
        this.startIndex = 0; 
        this.endIndex = totalFrames - 1; 
        this.columnsnumber = columnsnumber; 
        this.rowsnumber = rowsnumber; 
        
        this.lastUpdateTime = 0;  // Track the last update time for movement sprites
        this.animationDelay = 50;  // 1 second delay between frames for movement
        this.baseWidth = 120;
        this.baseHeight = 150;
        this.growthFactor = 1.01;
    }

    setAnimationRange(startIndex, endIndex) {
        if (this.startIndex !== startIndex || this.endIndex !== endIndex) {
            this.startIndex = startIndex;
            this.endIndex = endIndex;
            this.currentFrame = startIndex;
        }
    }
    /*  Older Function, Unoptimized
    setAnimationRange(startIndex, endIndex) {
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.currentFrame = startIndex;
    }*/

    drawCharacter() {
        

        const col = this.currentFrame % this.columnsnumber;
        const row = Math.floor(this.currentFrame / this.rowsnumber);
        const sx = col * this.spriteWidth;
        const sy = row * this.spriteHeight;

        // Draw the character at the center of the canvas (horizontally) with respect to its current y position
        ctx.drawImage(
            this.image,
            sx, sy, this.spriteWidth, this.spriteHeight,
            canvas.width / 2 - this.width / 2, this.y,
            this.width, this.height
        );
    }
    updateCharacterSize(score) {
        
    
        // Update width and height based on scor
        this.width = this.baseWidth * Math.pow(this.growthFactor, score);
        this.height = this.baseHeight * Math.pow(this.growthFactor, score);
    }

    updateAnimation() {
        if (++this.frameCounter >= this.frameDelay) {
            this.frameCounter = 0;
            this.currentFrame = this.currentFrame < this.endIndex ? this.currentFrame + 1 : this.startIndex;
        }
    }

    /*      Older function. Unoptimized!
    updateAnimation() {
        this.frameCounter++;
        if (this.frameCounter >= this.frameDelay) {
            this.frameCounter = 0;
            this.currentFrame++;
            if (this.currentFrame > this.endIndex) {
                this.currentFrame = this.startIndex;
            }
        }
    }*/

    applyGravity() {
        this.dy += global.gravity;
        this.y += this.dy;

        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            isOnGround = true;
        }
    }

    moveCharacter() {
        this.x += this.dx;

        const currentTime = Date.now();

        // Change sprite every second (1 second gap between frames)
        if (currentTime - this.lastUpdateTime >= this.animationDelay) {
            this.lastUpdateTime = currentTime;

            if (!isOnGround) {
                this.setAnimationRange(6, 6); // Animation for jumping/falling
                this.updateAnimation();
            } else if (this.dx > 0) {
                this.setAnimationRange(3, 4); // Animation for walking right
                this.updateAnimation();
            } else if (this.dx < 0) {
                this.setAnimationRange(1, 2); // Animation for walking left
                this.updateAnimation();
            } else {
                this.setAnimationRange(0, 0); // Animation for idle
            }
        }

        if (this.x < 0) {
            this.x = 0;
        } else if (
            this.y < 0) {
            this.dy = 5;
        } 

    }
}
