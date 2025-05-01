import React, { useState, useEffect } from 'react';
import GameUI from './components/GameUI';
import { useGameLoop } from './hooks/useGameLoop';
import { saveScore } from './utils/supabase';
import GameBackground from './components/GameBackground';
import StickmanCharacter from './components/StickmanCharacter';
import Platform from './components/Platform';

function App() {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  const {
    gameState,
    startGame,
    restartGame,
    handleKeyDown,
    handleKeyUp
  } = useGameLoop(dimensions.width, dimensions.height);
  
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (gameState.gameStatus === 'gameOver' && gameState.playerName) {
      saveScore(gameState.playerName, gameState.score);
    }
  }, [gameState.gameStatus, gameState.score, gameState.playerName]);
  
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <GameBackground cameraOffset={gameState.cameraOffset} />
      
      {gameState.platforms.map(platform => (
        <Platform
          key={platform.id}
          platform={platform}
          cameraOffset={gameState.cameraOffset}
        />
      ))}
      
      {gameState.player && (
        <StickmanCharacter
          player={gameState.player}
          cameraOffset={gameState.cameraOffset}
        />
      )}
      
      <GameUI 
        gameState={gameState}
        onStart={startGame}
        onRestart={restartGame}
      />
    </div>
  );
}

export default App;