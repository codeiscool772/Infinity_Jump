export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  position: Vector2D;
  velocity: Vector2D;
  size: Vector2D;
  id: string;
}

export interface Platform extends GameObject {
  type: 'normal' | 'moving' | 'crumbling' | 'bouncy';
  initialX?: number; // For moving platforms
}

export interface Player extends GameObject {
  state: PlayerState;
  jumpCount: number;
  isWallSliding: boolean;
  facingDirection: 'left' | 'right';
  lastJumpTime: number;
}

export type PlayerState = 'idle' | 'running' | 'jumping' | 'falling' | 'wallSliding' | 'dead';

export interface GameState {
  player: Player;
  platforms: Platform[];
  score: number;
  highScore: number;
  gameStatus: 'idle' | 'playing' | 'gameOver';
  difficulty: number;
  cameraOffset: Vector2D;
  lastPlatformX: number;
  playerName?: string;
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  created_at: string;
}