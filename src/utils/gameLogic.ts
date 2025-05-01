import { GameState, Platform, PlayerState, Vector2D } from '../types/game';
import { generatePlatform } from './terrainGenerator';
import { checkCollision } from './collision';
import { v4 as uuidv4 } from 'uuid';

// Physics constants
const GRAVITY = 0.3;
const PLAYER_SPEED = 4;
const JUMP_FORCE = -8; // Reduced from -10
const WALL_SLIDE_SPEED = 2;
const WALL_JUMP_FORCE = 6;
const MAX_JUMP_COUNT = 3;
const JUMP_COOLDOWN = 200;

// Platform movement constants
const PLATFORM_MOVE_SPEED = 2;
const PLATFORM_MOVE_RANGE = 150;

export const updateGameState = (
  state: GameState,
  deltaTime: number,
  input: { left: boolean; right: boolean; jump: boolean },
  canvasWidth: number,
  canvasHeight: number
): GameState => {
  if (state.gameStatus !== 'playing') return state;

  const newState = { ...state };
  
  // Update moving platforms
  updateMovingPlatforms(newState);
  
  // Update player position and physics
  updatePlayer(newState, input);
  
  // Update camera position to follow player
  updateCamera(newState, canvasWidth);
  
  // Update terrain
  updateTerrain(newState, canvasWidth);
  
  // Update score based on distance traveled
  newState.score = Math.floor(newState.player.position.x / 100);
  if (newState.score > newState.highScore) {
    newState.highScore = newState.score;
    localStorage.setItem('highScore', newState.highScore.toString());
  }
  
  // Check if player fell off screen
  if (newState.player.position.y > canvasHeight) {
    newState.gameStatus = 'gameOver';
  }
  
  return newState;
};

const updateMovingPlatforms = (state: GameState) => {
  state.platforms.forEach(platform => {
    if (platform.type === 'moving') {
      // Initialize movement properties if they don't exist
      if (!platform.velocity.x && !platform.velocity.y) {
        platform.velocity.x = PLATFORM_MOVE_SPEED;
        platform.initialX = platform.position.x;
      }
      
      // Move platform horizontally
      platform.position.x += platform.velocity.x;
      
      // Change direction at movement range boundaries
      if (platform.position.x >= platform.initialX + PLATFORM_MOVE_RANGE) {
        platform.velocity.x = -PLATFORM_MOVE_SPEED;
      } else if (platform.position.x <= platform.initialX - PLATFORM_MOVE_RANGE) {
        platform.velocity.x = PLATFORM_MOVE_SPEED;
      }
    }
  });
};

const updatePlayer = (state: GameState, input: { left: boolean; right: boolean; jump: boolean }) => {
  const { player } = state;
  
  // Apply gravity
  player.velocity.y += GRAVITY;
  
  // Horizontal movement
  if (input.left) {
    player.velocity.x = -PLAYER_SPEED;
    player.facingDirection = 'left';
  } else if (input.right) {
    player.velocity.x = PLAYER_SPEED;
    player.facingDirection = 'right';
  } else {
    // Apply friction
    player.velocity.x *= 0.6;
    if (Math.abs(player.velocity.x) < 0.1) player.velocity.x = 0;
  }
  
  // Check collisions with platforms
  let isGrounded = false;
  let isTouchingWall = false;
  let wallDirection: 'left' | 'right' | null = null;
  
  for (const platform of state.platforms) {
    const collision = checkCollision(player, platform);
    
    if (collision.collided) {
      switch (collision.side) {
        case 'top':
          player.position.y = platform.position.y - player.size.y;
          player.velocity.y = 0;
          isGrounded = true;
          player.jumpCount = 0;
          // If on a moving platform, move with it
          if (platform.type === 'moving') {
            player.position.x += platform.velocity.x;
          }
          break;
        case 'bottom':
          player.position.y = platform.position.y + platform.size.y;
          player.velocity.y = 0;
          break;
        case 'left':
          player.position.x = platform.position.x - player.size.x;
          isTouchingWall = true;
          wallDirection = 'left';
          break;
        case 'right':
          player.position.x = platform.position.x + platform.size.x;
          isTouchingWall = true;
          wallDirection = 'right';
          break;
      }
      
      // Handle special platform types
      if (platform.type === 'bouncy' && collision.side === 'top') {
        player.velocity.y = JUMP_FORCE * 1.5;
      }
    }
  }
  
  // Handle jumping
  if (input.jump) {
    const currentTime = Date.now();
    if (isGrounded && currentTime - player.lastJumpTime > JUMP_COOLDOWN) {
      player.velocity.y = JUMP_FORCE;
      player.jumpCount = 1;
      player.lastJumpTime = currentTime;
    } else if (!isGrounded && player.jumpCount === 1 && 
               currentTime - player.lastJumpTime > JUMP_COOLDOWN) {
      // Double jump
      player.velocity.y = JUMP_FORCE * 0.8;
      player.jumpCount = 2;
      player.lastJumpTime = currentTime;
    } else if (isTouchingWall && !isGrounded && 
               currentTime - player.lastJumpTime > JUMP_COOLDOWN) {
      // Wall jump
      player.velocity.y = JUMP_FORCE;
      player.velocity.x = wallDirection === 'left' ? WALL_JUMP_FORCE : -WALL_JUMP_FORCE;
      player.jumpCount = 1;
      player.lastJumpTime = currentTime;
    }
  }
  
  // Wall sliding
  player.isWallSliding = isTouchingWall && !isGrounded && player.velocity.y > 0;
  if (player.isWallSliding) {
    player.velocity.y = Math.min(player.velocity.y, WALL_SLIDE_SPEED);
  }
  
  // Apply velocity to position
  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;
  
  // Update player state
  if (player.isWallSliding) {
    player.state = 'wallSliding';
  } else if (isGrounded) {
    player.state = Math.abs(player.velocity.x) > 0.1 ? 'running' : 'idle';
  } else {
    player.state = player.velocity.y < 0 ? 'jumping' : 'falling';
  }
  
  // Prevent moving backwards past the start
  player.position.x = Math.max(player.position.x, 50);
};

const updateCamera = (state: GameState, canvasWidth: number) => {
  const targetX = state.player.position.x - canvasWidth * 0.3;
  state.cameraOffset.x += (targetX - state.cameraOffset.x) * 0.1;
};

const updateTerrain = (state: GameState, canvasWidth: number) => {
  // Remove platforms that are far behind
  state.platforms = state.platforms.filter(
    platform => platform.position.x + platform.size.x > state.cameraOffset.x - 100
  );
  
  // Generate new platforms ahead
  const visibleRightEdge = state.cameraOffset.x + canvasWidth + 500;
  while (state.lastPlatformX < visibleRightEdge) {
    const newPlatform = generatePlatform(state.lastPlatformX, state.difficulty);
    newPlatform.id = uuidv4();
    if (newPlatform.type === 'moving') {
      newPlatform.initialX = newPlatform.position.x;
    }
    state.platforms.push(newPlatform);
    state.lastPlatformX = newPlatform.position.x + newPlatform.size.x;
  }
};
