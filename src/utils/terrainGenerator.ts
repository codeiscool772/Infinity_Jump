import { Platform } from '../types/game';

// Platform generation settings
const BASE_WIDTH_MIN = 100;
const BASE_WIDTH_MAX = 300;
const BASE_HEIGHT = 20;
const BASE_Y_MIN = 300;
const BASE_Y_MAX = 500;
const PLATFORM_TYPES = ['normal', 'moving', 'crumbling', 'bouncy'] as const;
const PLATFORM_TYPE_WEIGHTS = [70, 10, 10, 10]; // Percentage chances

// Player movement constants for platform placement calculations
const MAX_JUMP_HEIGHT = 200; // Maximum height player can reach with a jump
const MAX_HORIZONTAL_JUMP = 250; // Maximum horizontal distance player can jump
const MAX_WALL_JUMP_HEIGHT = 180; // Maximum height reachable with wall jump
const MAX_WALL_JUMP_DISTANCE = 300; // Maximum distance reachable with wall jump

export const generatePlatform = (startX: number, difficulty: number): Platform => {
  const width = Math.random() * (BASE_WIDTH_MAX - BASE_WIDTH_MIN) / difficulty + BASE_WIDTH_MIN;
  
  let prevY = BASE_Y_MAX;
  let yPos: number;
  
  const heightDifference = Math.random() * MAX_JUMP_HEIGHT * 0.8;
  const minY = Math.max(BASE_Y_MIN, prevY - heightDifference);
  const maxY = Math.min(BASE_Y_MAX, prevY + heightDifference);
  yPos = Math.random() * (maxY - minY) + minY;
  
  const horizontalGap = Math.random() * (MAX_HORIZONTAL_JUMP * 0.8);
  
  const type = getWeightedRandomType(difficulty);
  
  return {
    position: { x: startX + horizontalGap, y: yPos },
    velocity: { x: 0, y: 0 },
    size: { x: width, y: BASE_HEIGHT },
    type,
    id: 'temp-id'
  };
};

const getWeightedRandomType = (difficulty: number): Platform['type'] => {
  const difficultyFactor = Math.min(difficulty, 3);
  
  const adjustedWeights = [
    PLATFORM_TYPE_WEIGHTS[0] - (difficultyFactor * 10),
    PLATFORM_TYPE_WEIGHTS[1] + (difficultyFactor * 3),
    PLATFORM_TYPE_WEIGHTS[2] + (difficultyFactor * 3),
    PLATFORM_TYPE_WEIGHTS[3] + (difficultyFactor * 4)
  ];
  
  const totalWeight = adjustedWeights.reduce((sum, weight) => sum + weight, 0);
  const random = Math.random() * totalWeight;
  
  let weightSum = 0;
  for (let i = 0; i < PLATFORM_TYPES.length; i++) {
    weightSum += adjustedWeights[i];
    if (random <= weightSum) {
      return PLATFORM_TYPES[i];
    }
  }
  
  return 'normal';
};

export const generateInitialPlatforms = (canvasWidth: number, canvasHeight: number): Platform[] => {
  const platforms: Platform[] = [];
  
  // Add starting platform - wider and positioned lower for better start
  platforms.push({
    position: { x: 0, y: canvasHeight - 100 }, // Positioned lower on screen
    velocity: { x: 0, y: 0 },
    size: { x: 400, y: BASE_HEIGHT }, // Wider starting platform
    type: 'normal',
    id: 'start-platform'
  });
  
  let lastX = 450; // Increased gap after starting platform
  let lastY = canvasHeight - 100;
  
  for (let i = 0; i < 10; i++) {
    const heightDifference = Math.random() * MAX_JUMP_HEIGHT * 0.7;
    const minY = Math.max(BASE_Y_MIN, lastY - heightDifference);
    const maxY = Math.min(BASE_Y_MAX, lastY + heightDifference);
    const yPos = Math.random() * (maxY - minY) + minY;
    
    const heightDelta = Math.abs(yPos - lastY);
    const maxGap = heightDelta > MAX_JUMP_HEIGHT / 2 
      ? MAX_WALL_JUMP_DISTANCE * 0.7
      : MAX_HORIZONTAL_JUMP * 0.8;
    
    const gap = Math.random() * maxGap + 50;
    
    const platform = {
      position: { x: lastX + gap, y: yPos },
      velocity: { x: 0, y: 0 },
      size: { x: Math.random() * (BASE_WIDTH_MAX - BASE_WIDTH_MIN) + BASE_WIDTH_MIN, y: BASE_HEIGHT },
      type: 'normal' as const,
      id: `initial-${i}`
    };
    
    platforms.push(platform);
    lastX = platform.position.x + platform.size.x;
    lastY = platform.position.y;
  }
  
  return platforms;
};