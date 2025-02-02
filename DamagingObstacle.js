import { ctx, damageObjects } from "./game.js";
import global from "./globals.js";

class Damage {
    constructor(x, y, width, height, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.originalHeight = height; // Store original height
        this.imageSrc = imageSrc;
        this.image = new Image();
        this.image.src = imageSrc;
        this.isSquishing = false; // Flag for squishing
        this.squishFactor = 1; // Scale factor for squishing
        this.squishSpeed = 0.05; // Speed of squishing effect
        this.resetting = false; // Flag for resetting
        damageObjects.push(this);
    }

    drawDamagingObstacle() {
        const adjustedX = this.x - global.cameraX;

        // Adjust the height and vertical position for squishing
        const currentHeight = this.height * this.squishFactor;
        const offsetY = (this.originalHeight - currentHeight) / 2;

        if (this.image.complete) {
            ctx.drawImage(this.image, adjustedX, this.y + offsetY, this.width, currentHeight);
        } else {
            this.image.onload = () => {
                ctx.drawImage(this.image, adjustedX, this.y + offsetY, this.width, currentHeight);
            };
        }

        // Animate the squishing effect
        if (this.isSquishing && !this.resetting) {
            this.squishFactor -= this.squishSpeed;
            if (this.squishFactor <= 0.4) { // Minimum height (60% squish)
                this.isSquishing = false;
                this.resetting = true; // Start resetting phase
            }
        }

        // Animate the reset effect
        if (this.resetting) {
            this.squishFactor += this.squishSpeed;
            if (this.squishFactor >= 1) { // Fully reset to original height
                this.resetting = false;
                this.squishFactor = 1; // Ensure it stays at the original height
                console.log('Damage object reset to original height!');
            }
        }
    }

    // Collision detection with the character
    checkCollisions(character) {
        const isTopCollision =
            this.x < character.x + character.width &&
            this.x + this.width > character.x &&
            character.y + character.height <= this.y &&
            character.y + character.height >= this.y - 5; // Allow a small tolerance for top collision
    
        const isLeftCollision =
            character.x + character.width >= this.x &&
            character.x + character.width <= this.x + 5 &&
            character.y < this.y + this.height &&
            character.y + character.height > this.y;
    
        const isRightCollision =
            character.x <= this.x + this.width &&
            character.x >= this.x + this.width - 5 &&
            character.y < this.y + this.height &&
            character.y + character.height > this.y;
    
        if (isTopCollision) {
            console.log("Collision: Top side of the obstacle");
            if (!this.isSquishing && !this.resetting) {
                this.isSquishing = true; // Trigger squish animation
            }
            return "top";
        } else if (isLeftCollision) {
            console.log("Collision: Left side of the obstacle");
            if (!this.isSquishing && !this.resetting) {
                this.isSquishing = true; // Trigger squish animation
            }
            return "left";
        } else if (isRightCollision) {
            console.log("Collision: Right side of the obstacle");
            if (!this.isSquishing && !this.resetting) {
                this.isSquishing = true; // Trigger squish animation
            }
            return "right";
        }

        return false;
    }
}

export { Damage };