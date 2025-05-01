import { useRef, useEffect, useState, useCallback } from 'react';
import { GameState } from '../types/game';
import { generateInitialState } from '../utils/gameInitializer';
import { updateGameState } from '../utils/gameLogic';

export const useGameLoop = (
  canvasWidth: number,
  canvasHeight: number
) => {
  const [gameState, setGameState] = useState<GameState>(generateInitialState(canvasWidth, canvasHeight));
  const keysPressed = useRef<Set<string>>(new Set());
  const frameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const startGame = (playerName: string) => {
    if (gameState.gameStatus !== 'playing') {
      setGameState(prev => ({ ...prev, gameStatus: 'playing', playerName }));
    }
  };

  const restartGame = () => {
    const playerName = gameState.playerName;
    setGameState({ ...generateInitialState(canvasWidth, canvasHeight), playerName });
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysPressed.current.add(e.key.toLowerCase());
    
    if (gameState.gameStatus === 'gameOver' && (e.key === ' ' || e.key === 'Enter')) {
      restartGame();
    }
  }, [gameState.gameStatus]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current.delete(e.key.toLowerCase());
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const deltaTime = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    const input = {
      left: keysPressed.current.has('a') || keysPressed.current.has('arrowleft'),
      right: keysPressed.current.has('d') || keysPressed.current.has('arrowright'),
      jump: keysPressed.current.has('w') || keysPressed.current.has('arrowup') || keysPressed.current.has(' '),
    };

    setGameState(prevState => 
      updateGameState(prevState, deltaTime, input, canvasWidth, canvasHeight)
    );

    frameRef.current = requestAnimationFrame(gameLoop);
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    if (gameState.gameStatus === 'playing') {
      frameRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameState.gameStatus, gameLoop]);

  return {
    gameState,
    startGame,
    restartGame,
    handleKeyDown,
    handleKeyUp
  };
};