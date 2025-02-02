import { interactiveObjects, ctx } from "./game.js";
import global from "./globals.js";

class InteractiveObjectsClass {
    constructor(x, y, width, height, imageSrc, move) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imageSrc = imageSrc; // Image source path
        this.image = new Image(); // Image object
        this.image.src = imageSrc; // Set the image source
        this.move = move;
        this.startingX = this.x;
        this.index = interactiveObjects.length; // Assign a unique index based on current count
        interactiveObjects.push(this)
    }

    drawBaseGameObject() {
        const adjustedX = this.x - global.cameraX;  // Adjust for camera movement (if needed)
        
        // Draw the food image once it is loaded
        if (this.image.complete) {
            ctx.drawImage(this.image, adjustedX, this.y, this.width, this.height);
        } else {
            // If the image is not loaded, load it and draw
            this.image.onload = () => {
                ctx.drawImage(this.image, adjustedX, this.y, this.width, this.height);
            };
        }
    }
    checkMovementReset() {
        // Check if the object has moved more than "move" to the left or right
        if (Math.abs(this.x - this.startingX) > this.move) {
            this.x = this.startingX; // Reset position to startingX
        }
    }

    displayMoveDistance() {
        const leftDistance = Math.max(0, this.x - (this.startingX - this.move)); // Distance to the left limit
        const rightDistance = Math.max(0, (this.startingX + this.move) - this.x); // Distance to the right limit


        ctx.fillStyle = "red";
        ctx.font = "20px Arial";
        ctx.fillText(
            `Object${this.index + 1} - Left: ${leftDistance}px, Right: ${rightDistance}px`,
            500, // X-coordinate for the text
            20 + this.index * 30 // Y-coordinate, offset by index
        );
    }

    reset() {
        this.x = this.startingX;  // Reset position
        this.y = 0;                // Reset to an initial y-coordinate if needed
        // Add other properties to reset here if necessary
    }
    
    
}

export { InteractiveObjectsClass };