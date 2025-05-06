// Super Platformer Game

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 450;

// Game state
let gameState = "playing"; // playing, paused, gameover, levelcomplete
let level = 1;
let maxLevel = 3;

// Game settings
const GRAVITY = 0.5;
const FRICTION = 0.8;
const JUMP_POWER = 14;
const PLAYER_SPEED = 5;

// Game elements
let player = {
  x: 50,
  y: canvas.height - 150,
  width: 40,
  height: 60,
  speed: PLAYER_SPEED,
  velX: 0,
  velY: 0,
  jumping: false,
  grounded: false,
  invincible: false,
  invincibleTimer: 0,
  facingRight: true,
  lives: 3,
  coins: 0,
  spriteState: "idle",
  frameX: 0,
  frameTimer: 0,
  animationSpeed: 5,
};

// Game objects arrays
let platforms = [];
let coins = [];
let enemies = [];
let powerups = [];

// Sprite images
const sprites = {
  player: {
    idle: createPlayerSprite("idle"),
    run: createPlayerSprite("run"),
    jump: createPlayerSprite("jump"),
  },
  platform: createPlatformSprite(),
  coin: createCoinSprite(),
  enemy: createEnemySprite(),
  background: createBackgroundSprite(),
  powerup: createPowerupSprite(),
};

// Create sprite functions
function createPlayerSprite(state) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 40;
  canvas.height = 60;

  // Colors
  const red = "#e74c3c";
  const blue = "#3498db";
  const skin = "#f5d0a9";
  const brown = "#a0522d";

  // Base player - Mario style
  ctx.fillStyle = red; // Red shirt
  ctx.fillRect(5, 20, 30, 20);

  // Blue overalls
  ctx.fillStyle = blue;
  ctx.fillRect(5, 40, 30, 10);
  ctx.fillRect(10, 30, 20, 10);

  // Arms
  ctx.fillStyle = skin;
  if (state === "run") {
    // Running pose - arms extended
    ctx.fillRect(0, 25, 5, 10);
    ctx.fillRect(35, 25, 5, 10);
  } else {
    // Normal arms
    ctx.fillRect(0, 30, 10, 5);
    ctx.fillRect(30, 30, 10, 5);
  }

  // Legs
  ctx.fillStyle = blue;
  if (state === "run") {
    // Running stance
    ctx.fillRect(10, 50, 8, 10);
    ctx.fillRect(22, 50, 8, 10);
  } else if (state === "jump") {
    // Jumping stance
    ctx.fillRect(8, 50, 10, 10);
    ctx.fillRect(22, 50, 10, 10);
  } else {
    // Normal stance
    ctx.fillRect(10, 50, 8, 10);
    ctx.fillRect(22, 50, 8, 10);
  }

  // Shoes
  ctx.fillStyle = brown;
  ctx.fillRect(8, 57, 12, 3);
  ctx.fillRect(20, 57, 12, 3);

  // Head
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(20, 15, 10, 0, Math.PI * 2);
  ctx.fill();

  // Hat
  ctx.fillStyle = red;
  ctx.fillRect(5, 10, 30, 5);
  ctx.fillRect(10, 5, 20, 5);

  // Eyes
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(23, 15, 2, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(24, 15, 1, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

function createPlatformSprite() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 100;
  canvas.height = 30;

  // Base
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(0, 10, 100, 20);

  // Top grass
  ctx.fillStyle = "#2ecc71";
  ctx.fillRect(0, 0, 100, 10);
  ctx.fillStyle = "#27ae60";

  // Grass detail
  for (let i = 0; i < 10; i++) {
    ctx.fillRect(i * 10 + 5, 0, 2, 5);
  }

  // Brick pattern
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(i * 20, 15, 15, 5);
    ctx.fillRect(i * 20 + 10, 20, 15, 5);
  }

  return canvas;
}

function createCoinSprite() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 20;
  canvas.height = 20;

  // Gold coin
  ctx.fillStyle = "#f1c40f";
  ctx.beginPath();
  ctx.arc(10, 10, 8, 0, Math.PI * 2);
  ctx.fill();

  // Inner detail
  ctx.fillStyle = "#f39c12";
  ctx.beginPath();
  ctx.arc(10, 10, 6, 0, Math.PI * 2);
  ctx.fill();

  // Shine
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(7, 7, 2, 0, Math.PI * 2);
  ctx.fill();

  return canvas;
}

function createEnemySprite() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 40;
  canvas.height = 40;

  // Goomba-like enemy body
  ctx.fillStyle = "#7f5539";
  ctx.beginPath();
  ctx.arc(20, 25, 15, 0, Math.PI * 2);
  ctx.fill();

  // Feet
  ctx.fillStyle = "#9c6644";
  ctx.beginPath();
  ctx.ellipse(10, 38, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(30, 38, 8, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(15, 20, 3, 0, Math.PI * 2);
  ctx.arc(25, 20, 3, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(15, 20, 1.5, 0, Math.PI * 2);
  ctx.arc(25, 20, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Angry eyebrows
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(12, 16);
  ctx.lineTo(18, 18);
  ctx.moveTo(22, 18);
  ctx.lineTo(28, 16);
  ctx.stroke();

  return canvas;
}

function createBackgroundSprite() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 450;

  // Sky
  const gradient = ctx.createLinearGradient(0, 0, 0, 450);
  gradient.addColorStop(0, "#3498db");
  gradient.addColorStop(1, "#87CEEB");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 450);

  // Sun
  ctx.fillStyle = "#f1c40f";
  ctx.beginPath();
  ctx.arc(700, 80, 50, 0, Math.PI * 2);
  ctx.fill();

  // Clouds
  ctx.fillStyle = "white";

  // Cloud 1
  ctx.beginPath();
  ctx.arc(100, 100, 30, 0, Math.PI * 2);
  ctx.arc(130, 90, 40, 0, Math.PI * 2);
  ctx.arc(160, 100, 30, 0, Math.PI * 2);
  ctx.fill();

  // Cloud 2
  ctx.beginPath();
  ctx.arc(450, 70, 35, 0, Math.PI * 2);
  ctx.arc(500, 60, 45, 0, Math.PI * 2);
  ctx.arc(540, 70, 35, 0, Math.PI * 2);
  ctx.fill();

  // Distant mountains
  ctx.fillStyle = "#7f8c8d";
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.lineTo(150, 200);
  ctx.lineTo(300, 280);
  ctx.lineTo(500, 180);
  ctx.lineTo(650, 250);
  ctx.lineTo(800, 220);
  ctx.lineTo(800, 450);
  ctx.lineTo(0, 450);
  ctx.closePath();
  ctx.fill();

  // Closer hills
  ctx.fillStyle = "#2ecc71";
  ctx.beginPath();
  ctx.moveTo(0, 320);
  ctx.bezierCurveTo(200, 270, 300, 350, 400, 300);
  ctx.bezierCurveTo(550, 250, 650, 320, 800, 280);
  ctx.lineTo(800, 450);
  ctx.lineTo(0, 450);
  ctx.closePath();
  ctx.fill();

  return canvas;
}

function createPowerupSprite() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 30;
  canvas.height = 30;

  // Mushroom cap
  ctx.fillStyle = "#e74c3c";
  ctx.beginPath();
  ctx.arc(15, 15, 12, 0, Math.PI * 2);
  ctx.fill();

  // White spots
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(10, 10, 3, 0, Math.PI * 2);
  ctx.arc(20, 13, 4, 0, Math.PI * 2);
  ctx.arc(15, 20, 3, 0, Math.PI * 2);
  ctx.fill();

  // Mushroom base
  ctx.fillStyle = "#ecf0f1";
  ctx.fillRect(10, 22, 10, 8);

  return canvas;
}

// Input handling
const keys = {
  left: false,
  right: false,
  up: false,
  spacePress: false,
};

function handleKeyDown(e) {
  if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
  if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") {
    keys.up = true;
    if (e.key === " ") keys.spacePress = true;
  }
  if (e.key === "p") togglePause();
}

function handleKeyUp(e) {
  if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
  if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
  if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") {
    keys.up = false;
    if (e.key === " ") keys.spacePress = false;
  }
}

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Handle restart button
document.getElementById("restartButton").addEventListener("click", () => {
  resetGame();
});

// Level loading
function loadLevel(levelNum) {
  // Clear existing objects
  platforms = [];
  coins = [];
  enemies = [];
  powerups = [];

  // Set player starting position
  player.x = 50;
  player.y = canvas.height - 150;
  player.velX = 0;
  player.velY = 0;

  switch (levelNum) {
    case 1:
      // First level - introductory platforms and few enemies
      // Ground
      platforms.push({
        x: 0,
        y: canvas.height - 40,
        width: 300,
        height: 40,
      });

      platforms.push({
        x: 350,
        y: canvas.height - 40,
        width: 450,
        height: 40,
      });

      // Gap in the middle

      // Upper platforms
      platforms.push({
        x: 150,
        y: canvas.height - 120,
        width: 100,
        height: 30,
      });

      platforms.push({
        x: 320,
        y: canvas.height - 150,
        width: 100,
        height: 30,
      });

      platforms.push({
        x: 500,
        y: canvas.height - 180,
        width: 100,
        height: 30,
      });

      // Coins
      coins.push({
        x: 200,
        y: canvas.height - 160,
        width: 20,
        height: 20,
        collected: false,
      });

      coins.push({
        x: 370,
        y: canvas.height - 190,
        width: 20,
        height: 20,
        collected: false,
      });

      coins.push({
        x: 550,
        y: canvas.height - 220,
        width: 20,
        height: 20,
        collected: false,
      });

      coins.push({
        x: 700,
        y: canvas.height - 80,
        width: 20,
        height: 20,
        collected: false,
      });

      // Enemies
      enemies.push({
        x: 400,
        y: canvas.height - 80,
        width: 40,
        height: 40,
        speed: 2,
        direction: -1,
        minX: 350,
        maxX: 500,
      });

      // Powerup
      powerups.push({
        x: 250,
        y: canvas.height - 160,
        width: 30,
        height: 30,
        type: "extraLife",
        collected: false,
      });

      break;

    case 2:
      // Second level - more complex jumps
      // Ground platforms
      platforms.push({
        x: 0,
        y: canvas.height - 40,
        width: 200,
        height: 40,
      });

      platforms.push({
        x: 260,
        y: canvas.height - 40,
        width: 120,
        height: 40,
      });

      platforms.push({
        x: 440,
        y: canvas.height - 40,
        width: 120,
        height: 40,
      });

      platforms.push({
        x: 620,
        y: canvas.height - 40,
        width: 180,
        height: 40,
      });

      // Upper platforms
      platforms.push({
        x: 150,
        y: canvas.height - 140,
        width: 80,
        height: 30,
      });

      platforms.push({
        x: 280,
        y: canvas.height - 180,
        width: 80,
        height: 30,
      });

      platforms.push({
        x: 430,
        y: canvas.height - 220,
        width: 80,
        height: 30,
      });

      platforms.push({
        x: 580,
        y: canvas.height - 260,
        width: 80,
        height: 30,
      });

      // Coins
      coins.push({
        x: 175,
        y: canvas.height - 180,
        width: 20,
        height: 20,
        collected: false,
      });

      coins.push({
        x: 305,
        y: canvas.height - 220,
        width: 20,
        height: 20,
        collected: false,
      });

      coins.push({
        x: 455,
        y: canvas.height - 260,
        width: 20,
        height: 20,
        collected: false,
      });

      coins.push({
        x: 605,
        y: canvas.height - 300,
        width: 20,
        height: 20,
        collected: false,
      });

      coins.push({
        x: 320,
        y: canvas.height - 80,
        width: 20,
        height: 20,
        collected: false,
      });

      coins.push({
        x: 500,
        y: canvas.height - 80,
        width: 20,
        height: 20,
        collected: false,
      });

      // Enemies
      enemies.push({
        x: 300,
        y: canvas.height - 80,
        width: 40,
        height: 40,
        speed: 2,
        direction: 1,
        minX: 270,
        maxX: 370,
      });

      enemies.push({
        x: 480,
        y: canvas.height - 80,
        width: 40,
        height: 40,
        speed: 3,
        direction: -1,
        minX: 450,
        maxX: 550,
      });

      // Powerup
      powerups.push({
        x: 520,
        y: canvas.height - 280,
        width: 30,
        height: 30,
        type: "extraLife",
        collected: false,
      });

      break;

    case 3:
      // Third level - challenging with more enemies
      // Ground
      platforms.push({
        x: 0,
        y: canvas.height - 40,
        width: 180,
        height: 40,
      });

      platforms.push({
        x: 240,
        y: canvas.height - 40,
        width: 100,
        height: 40,
      });

      platforms.push({
        x: 400,
        y: canvas.height - 40,
        width: 100,
        height: 40,
      });

      platforms.push({
        x: 560,
        y: canvas.height - 40,
        width: 240,
        height: 40,
      });

      // Middle platforms
      platforms.push({
        x: 120,
        y: canvas.height - 120,
        width: 80,
        height: 30,
      });

      platforms.push({
        x: 260,
        y: canvas.height - 150,
        width: 80,
        height: 30,
      });

      platforms.push({
        x: 400,
        y: canvas.height - 180,
        width: 80,
        height: 30,
      });

      platforms.push({
        x: 540,
        y: canvas.height - 210,
        width: 80,
        height: 30,
      });

      // Top platforms
      platforms.push({
        x: 200,
        y: canvas.height - 250,
        width: 80,
        height: 30,
      });

      platforms.push({
        x: 350,
        y: canvas.height - 280,
        width: 80,
        height: 30,
      });

      platforms.push({
        x: 500,
        y: canvas.height - 310,
        width: 80,
        height: 30,
      });

      // Coins
      // Lower level
      coins.push({
        x: 150,
        y: canvas.height - 80,
        width: 20,
        height: 20,
        collected: false,
      });

      coins.push({
        x: 290,
        y: canvas.height - 80,
        width: 20,
        height: 20,
        collected: false,
      });

      coins.push({
        x: 450,
        y: canvas.height - 80,
        width: 20,
        height: 20,
        collected: false,
      });

      // Middle level
      coins.push({
        x: 160,
        y: canvas.height - 160,
        width: 20,
        height: 20,
        collected: false,
      });

      coins.push({
        x: 300,
        y: canvas.height - 190,
        width: 20,
        height: 20,
        collected: false,
      });

      coins.push({
        x: 440,
        y: canvas.height - 220,
        width: 20,
        height: 20,
        collected: false,
      });

      // Top level
      coins.push({
        x: 230,
        y: canvas.height - 290,
        width: 20,
        height: 20,
        collected: false,
      });

      coins.push({
        x: 380,
        y: canvas.height - 320,
        width: 20,
        height: 20,
        collected: false,
      });

      coins.push({
        x: 530,
        y: canvas.height - 350,
        width: 20,
        height: 20,
        collected: false,
      });

      // Enemies
      // On ground
      enemies.push({
        x: 280,
        y: canvas.height - 80,
        width: 40,
        height: 40,
        speed: 2,
        direction: 1,
        minX: 240,
        maxX: 340,
      });

      enemies.push({
        x: 440,
        y: canvas.height - 80,
        width: 40,
        height: 40,
        speed: 2.5,
        direction: -1,
        minX: 400,
        maxX: 500,
      });

      enemies.push({
        x: 650,
        y: canvas.height - 80,
        width: 40,
        height: 40,
        speed: 3,
        direction: -1,
        minX: 560,
        maxX: 760,
      });

      // On platforms
      enemies.push({
        x: 420,
        y: canvas.height - 220,
        width: 40,
        height: 40,
        speed: 1,
        direction: 1,
        minX: 400,
        maxX: 480,
      });

      // Powerups
      powerups.push({
        x: 300,
        y: canvas.height - 190,
        width: 30,
        height: 30,
        type: "extraLife",
        collected: false,
      });

      powerups.push({
        x: 650,
        y: canvas.height - 250,
        width: 30,
        height: 30,
        type: "extraLife",
        collected: false,
      });

      break;
  }
}

// Game mechanics
function updatePlayer() {
  // Handle horizontal movement
  if (keys.right) {
    player.velX = player.speed;
    player.facingRight = true;
    player.spriteState = player.grounded ? "run" : "jump";
  } else if (keys.left) {
    player.velX = -player.speed;
    player.facingRight = false;
    player.spriteState = player.grounded ? "run" : "jump";
  } else {
    player.velX *= FRICTION;
    if (Math.abs(player.velX) < 0.1) player.velX = 0;
    player.spriteState = player.grounded ? "idle" : "jump";
  }

  // Apply gravity
  player.velY += GRAVITY;

  // Handle jumping
  if (keys.up && player.grounded && !player.jumping) {
    player.velY = -JUMP_POWER;
    player.jumping = true;
    player.grounded = false;
    player.spriteState = "jump";
  }

  // Move player
  player.x += player.velX;
  player.y += player.velY;

  // Check world boundaries
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }

  // Reset grounded state
  player.grounded = false;

  // Platform collision
  for (let i = 0; i < platforms.length; i++) {
    const platform = platforms[i];

    // Check if player is on top of platform
    const onTop =
      player.y + player.height > platform.y &&
      player.y < platform.y &&
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width;

    if (onTop && player.velY >= 0) {
      player.grounded = true;
      player.jumping = false;
      player.velY = 0;
      player.y = platform.y - player.height;
    }

    // Side collisions
    else if (
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width &&
      player.y + player.height > platform.y &&
      player.y < platform.y + platform.height
    ) {
      if (player.x + player.width / 2 < platform.x + platform.width / 2) {
        // Left collision
        player.x = platform.x - player.width;
      } else {
        // Right collision
        player.x = platform.x + platform.width;
      }
    }
  }

  // Check if player fell off the screen
  if (player.y > canvas.height) {
    loseLife();
  }

  // Update invincibility timer
  if (player.invincible) {
    player.invincibleTimer--;
    if (player.invincibleTimer <= 0) {
      player.invincible = false;
    }
  }

  // Handle animation frames
  player.frameTimer++;
  if (player.frameTimer > player.animationSpeed) {
    player.frameTimer = 0;
    player.frameX = (player.frameX + 1) % 2;
  }
}

function updateEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];

    // Move enemy based on direction
    enemy.x += enemy.speed * enemy.direction;

    // Change direction if reached boundary
    if (enemy.x <= enemy.minX) {
      enemy.direction = 1;
    } else if (enemy.x >= enemy.maxX) {
      enemy.direction = -1;
    }

    // Check collision with player
    if (
      !player.invincible &&
      player.x < enemy.x + enemy.width - 10 &&
      player.x + player.width > enemy.x + 10 &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      // Player jumped on top of enemy
      if (
        player.velY > 0 &&
        player.y + player.height < enemy.y + enemy.height / 2
      ) {
        // Remove enemy
        enemies.splice(i, 1);
        i--;

        // Bounce player
        player.velY = -10;
      } else {
        // Player got hit by enemy
        loseLife();
      }
    }
  }
}

function updateCoins() {
  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];
    if (
      !coin.collected &&
      player.x < coin.x + coin.width &&
      player.x + player.width > coin.x &&
      player.y < coin.y + coin.height &&
      player.y + player.height > coin.y
    ) {
      coin.collected = true;
      player.coins++;
      updateHUD();

      // Check if all coins collected
      if (allCoinsCollected()) {
        levelComplete();
      }
    }
  }
}

function updatePowerups() {
  for (let i = 0; i < powerups.length; i++) {
    const powerup = powerups[i];
    if (
      !powerup.collected &&
      player.x < powerup.x + powerup.width &&
      player.x + player.width > powerup.x &&
      player.y < powerup.y + powerup.height &&
      player.y + player.height > powerup.y
    ) {
      powerup.collected = true;

      // Apply powerup effect
      if (powerup.type === "extraLife") {
        player.lives++;
        updateHUD();
      }
    }
  }
}

function allCoinsCollected() {
  return coins.every((coin) => coin.collected);
}

function loseLife() {
  if (player.invincible) return;

  player.lives--;
  updateHUD();

  if (player.lives <= 0) {
    gameOver();
  } else {
    // Respawn player
    player.x = 50;
    player.y = canvas.height - 150;
    player.velX = 0;
    player.velY = 0;

    // Make player briefly invincible
    player.invincible = true;
    player.invincibleTimer = 60; // About 1 second at 60fps
  }
}

function gameOver() {
  gameState = "gameover";

  // Show game over overlay
  showGameOverOverlay();
}

function levelComplete() {
  if (level < maxLevel) {
    level++;
    loadLevel(level);
  } else {
    // Game completed
    gameState = "completed";
    showGameCompletedOverlay();
  }
}

function togglePause() {
  if (gameState === "playing") {
    gameState = "paused";
  } else if (gameState === "paused") {
    gameState = "playing";
  }
}

function resetGame() {
  // Reset game state
  gameState = "playing";
  level = 1;

  // Reset player
  player.lives = 3;
  player.coins = 0;
  player.invincible = false;

  // Update HUD
  updateHUD();

  // Load first level
  loadLevel(1);

  // Remove any overlays
  hideOverlays();
}

function showGameOverOverlay() {
  // Create overlay if it doesn't exist
  let overlay = document.getElementById("gameOverOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "gameOverOverlay";
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    overlay.style.color = "white";
    overlay.style.fontSize = "36px";
    overlay.style.textAlign = "center";
    overlay.style.paddingTop = "150px";
    overlay.style.zIndex = "100";
    overlay.innerHTML = `
      <h2>Game Over</h2>
      <p>You ran out of lives!</p>
      <button id="restartFromOverlay" style="margin-top: 20px; font-size: 24px; padding: 10px 20px;">Try Again</button>
    `;

    document.querySelector(".game-container").appendChild(overlay);

    document
      .getElementById("restartFromOverlay")
      .addEventListener("click", () => {
        resetGame();
      });
  } else {
    overlay.style.display = "block";
  }
}

function showGameCompletedOverlay() {
  // Create overlay if it doesn't exist
  let overlay = document.getElementById("gameCompletedOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "gameCompletedOverlay";
    overlay.style.position = "absolute";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    overlay.style.color = "white";
    overlay.style.fontSize = "36px";
    overlay.style.textAlign = "center";
    overlay.style.paddingTop = "150px";
    overlay.style.zIndex = "100";
    overlay.innerHTML = `
      <h2>Congratulations!</h2>
      <p>You completed all levels!</p>
      <p>Total coins: ${player.coins}</p>
      <button id="playAgainButton" style="margin-top: 20px; font-size: 24px; padding: 10px 20px;">Play Again</button>
    `;

    document.querySelector(".game-container").appendChild(overlay);

    document.getElementById("playAgainButton").addEventListener("click", () => {
      resetGame();
    });
  } else {
    overlay.style.display = "block";
  }
}

function hideOverlays() {
  const gameOverOverlay = document.getElementById("gameOverOverlay");
  if (gameOverOverlay) {
    gameOverOverlay.style.display = "none";
  }

  const gameCompletedOverlay = document.getElementById("gameCompletedOverlay");
  if (gameCompletedOverlay) {
    gameCompletedOverlay.style.display = "none";
  }
}

function updateHUD() {
  document.getElementById("coinCount").textContent = player.coins;
  document.getElementById("livesCount").textContent = player.lives;
}

// Drawing functions
function drawBackground() {
  ctx.drawImage(sprites.background, 0, 0, canvas.width, canvas.height);
}

function drawPlatforms() {
  for (const platform of platforms) {
    // Draw platform as stretched or tiled based on width
    if (platform.width <= 100) {
      ctx.drawImage(
        sprites.platform,
        platform.x,
        platform.y,
        platform.width,
        platform.height
      );
    } else {
      // Tile the platform sprite
      const tilesNeeded = Math.ceil(platform.width / 100);
      for (let i = 0; i < tilesNeeded; i++) {
        const width = Math.min(100, platform.width - i * 100);
        ctx.drawImage(
          sprites.platform,
          0,
          0,
          width,
          30,
          platform.x + i * 100,
          platform.y,
          width,
          platform.height
        );
      }
    }
  }
}

function drawCoins() {
  for (const coin of coins) {
    if (!coin.collected) {
      ctx.drawImage(sprites.coin, coin.x, coin.y, coin.width, coin.height);
    }
  }
}

function drawPowerups() {
  for (const powerup of powerups) {
    if (!powerup.collected) {
      ctx.drawImage(
        sprites.powerup,
        powerup.x,
        powerup.y,
        powerup.width,
        powerup.height
      );
    }
  }
}

function drawEnemies() {
  for (const enemy of enemies) {
    if (enemy.direction > 0) {
      // Facing right
      ctx.drawImage(sprites.enemy, enemy.x, enemy.y, enemy.width, enemy.height);
    } else {
      // Facing left - flip the sprite
      ctx.save();
      ctx.translate(enemy.x + enemy.width, enemy.y);
      ctx.scale(-1, 1);
      ctx.drawImage(sprites.enemy, 0, 0, enemy.width, enemy.height);
      ctx.restore();
    }
  }
}

function drawPlayer() {
  const playerSprite = sprites.player[player.spriteState];

  // Blinking effect when invincible
  if (player.invincible && Math.floor(player.invincibleTimer / 5) % 2 === 0)
    return;

  if (player.facingRight) {
    // Draw player facing right
    ctx.drawImage(
      playerSprite,
      player.x,
      player.y,
      player.width,
      player.height
    );
  } else {
    // Draw player facing left (flip horizontally)
    ctx.save();
    ctx.translate(player.x + player.width, player.y);
    ctx.scale(-1, 1);
    ctx.drawImage(playerSprite, 0, 0, player.width, player.height);
    ctx.restore();
  }
}

function drawPauseScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
  ctx.font = "24px Arial";
  ctx.fillText("Press P to continue", canvas.width / 2, canvas.height / 2 + 40);
}

// Game loop
function gameLoop() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  drawBackground();

  // Update game logic if not paused or game over
  if (gameState === "playing") {
    updatePlayer();
    updateEnemies();
    updateCoins();
    updatePowerups();
  }

  // Draw game elements
  drawPlatforms();
  drawCoins();
  drawPowerups();
  drawEnemies();
  drawPlayer();

  // Draw pause screen if paused
  if (gameState === "paused") {
    drawPauseScreen();
  }

  // Request next frame
  requestAnimationFrame(gameLoop);
}

// Initialize game
function init() {
  // Set up canvas
  canvas.width = 800;
  canvas.height = 450;

  // Load first level
  resetGame();

  // Start game loop
  gameLoop();
}

// Start the game
init();
