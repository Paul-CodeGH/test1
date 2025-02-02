import { backgroundImage, ctx, canvas} from "./game.js";
import global from "./globals.js";


class Background {
    constructor(imageSrc) {
        this.imageSrc = imageSrc; // Image source path
        this.image = new Image(); // Image object
        this.image.src = imageSrc; // Set the image source
        backgroundImage.push(this);
    }

    drawBackground() {
        // Ensure the background starts at the left edge of the canvas
        const backgroundX = global.cameraX * global.backgroundSpeedFactor;
    
        // Draw the background image starting at the cameraX position
        ctx.drawImage(this.image, backgroundX, 0, this.image.width, canvas.height);
        // Draw the second part of the background image, creating the scrolling effect
        ctx.drawImage(this.image, backgroundX + this.image.width, 0, this.image.width, canvas.height);
        
        
    }
}

export { Background };