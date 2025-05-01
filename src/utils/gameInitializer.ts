import { GameState } from '../types/game';
import { generateInitialPlatforms } from './terrainGenerator';

export const generateInitialState = (canvasWidth: number, canvasHeight: number): GameState => {
  const initialPlatforms = generateInitialPlatforms(canvasWidth, canvasHeight);
  
  // Position player just above the starting platform
  const startingPlatform = initialPlatforms[0];
  const playerStartY = startingPlatform.position.y - 50; // 50 is player height
  
  return {
    player: {
      position: { x: 100, y: playerStartY },
      velocity: { x: 0, y: 0 },
      size: { x: 30, y: 50 },
      state: 'idle',
      jumpCount: 0,
      isWallSliding: false,
      facingDirection: 'right',
      lastJumpTime: 0,
      id: 'player'
    },
    platforms: initialPlatforms,
    score: 0,
    highScore: localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')!) : 0,
    gameStatus: 'idle',
    difficulty: 1,
    cameraOffset: { x: 0, y: 0 },
    lastPlatformX: initialPlatforms.length > 0 
      ? Math.max(...initialPlatforms.map(p => p.position.x + p.size.x))
      : 300
  };
};