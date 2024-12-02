import { canvas, ctx } from "./constant.js";
import { player } from "./jet.js";
import { meteors_array } from "./meteors.js";
import { bullets } from "./jet.js"; // Import bullets array from jet.js
import { gameState } from "./game.js";

// Player lives configuration
let lives = 3; // Number of lives
const heartImage = new Image();
heartImage.src = "../Game/Images/heart.png"; // Path to heart image

heartImage.onload = () => {
  console.log("Heart image successfully loaded!");
};

export function drawLives() {
  if (!heartImage.complete) {
    console.error("Heart image not loaded yet.");
    return;
  }

  const heartSize = 40; // Adjusted heart size for better visibility
  const spacing = 10; // Spacing between hearts
  const marginRight = 20; // Margin from the right edge
  const marginTop = 20; // Margin from the top edge

  // Start drawing hearts from the right side
  const startX = canvas.width - marginRight - lives * (heartSize + spacing);
  const startY = marginTop; // Position near the top of the canvas

  for (let i = 0; i < lives; i++) {
    const x = startX + i * (heartSize + spacing);
    ctx.drawImage(heartImage, x, startY, heartSize, heartSize);
  }
}

// Function to check for collision between two rectangles
function isCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export function checkCollisions() {
  meteors_array.forEach((meteor, index) => {
    const meteorHitbox = {
      x: meteor.x,
      y: meteor.y,
      width: 100,
      height: 100,
    };

    const jetHitbox = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height,
    };

    if (isCollisionWithDistance(jetHitbox, meteorHitbox)) {
      console.log("Collision detected with Jet!");
      meteors_array.splice(index, 1);
      reduceLives();
    }
  });
}

export function checkProjectileCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    meteors_array.forEach((meteor, meteorIndex) => {
      // Define hitboxes for bullet and meteor
      const bulletHitbox = {
        x: bullet.x,
        y: bullet.y,
        width: bullet.width,
        height: bullet.height,
      };

      const meteorHitbox = {
        x: meteor.x,
        y: meteor.y,
        width: 100, // Same size as the meteor image
        height: 100,
      };

      // Check for collision between bullet and meteor
      if (isCollision(bulletHitbox, meteorHitbox)) {
        console.log("Projectile hit detected!");
        console.log("Bullet Hitbox:", bulletHitbox);
        console.log("Meteor Hitbox:", meteorHitbox);
        bullets.splice(bulletIndex, 1); // Remove the bullet
        meteors_array.splice(meteorIndex, 1); // Remove the meteor
      }
    });
  });
}

// Function to check collision based on the distance between two objects
function isCollisionWithDistance(obj1, obj2) {
  // Calculate the horizontal and vertical distances between the center points
  const dx = obj1.x + obj1.width / 2 - (obj2.x + obj2.width / 2); // Horizontal distance
  const dy = obj1.y + obj1.height / 2 - (obj2.y + obj2.height / 2); // Vertical distance
  const distance = Math.sqrt(dx * dx + dy * dy); // Euclidean distance between the centers

  // Define a threshold based on the object sizes for a collision to occur
  const collisionThreshold = (obj1.width + obj2.width) / 4; // Adjust this value as needed

  // Return true if the distance is smaller than the collision threshold
  return distance < collisionThreshold;
}

// Function to reduce lives when a collision occurs
export function reduceLives() {
  if (lives > 0) {
    lives -= 1; // Decrease lives
    console.log(`Collision detected! Lives remaining: ${lives}`);
    if (lives === 0) {
      gameOver(); // Handle game over logic when lives reach 0
    }
  }
}

// Function to handle game over
function gameOver() {
  console.log("Game Over!");
  // Stop the game animation
  gameState.paused = true;
  cancelAnimationFrame(gameState.animationFrameID);

  // Display Game Over screen
  const gameOverScreen = document.createElement("div");
  gameOverScreen.id = "game-over-screen";
  gameOverScreen.style.position = "fixed";
  gameOverScreen.style.top = "0";
  gameOverScreen.style.left = "0";
  gameOverScreen.style.width = "100%";
  gameOverScreen.style.height = "100%";
  gameOverScreen.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  gameOverScreen.style.display = "flex";
  gameOverScreen.style.flexDirection = "column";
  gameOverScreen.style.alignItems = "center";
  gameOverScreen.style.justifyContent = "center";
  gameOverScreen.style.color = "white";
  gameOverScreen.style.zIndex = "1000";

  const message = document.createElement("h1");
  message.innerText = "Game Over";
  gameOverScreen.appendChild(message);

  const restartButton = document.createElement("button");
  restartButton.innerText = "Restart Game";
  restartButton.style.padding = "10px 20px";
  restartButton.style.marginTop = "20px";
  restartButton.style.fontSize = "1.2em";
  restartButton.style.cursor = "pointer";

  restartButton.onclick = function () {
    window.location.reload(); // Reload the page to restart the game
  };

  gameOverScreen.appendChild(restartButton);
  document.body.appendChild(gameOverScreen);
}
