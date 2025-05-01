import React from 'react';
import { Player } from '../types/game';

interface StickmanCharacterProps {
  player: Player;
  cameraOffset: { x: number; y: number };
}

const StickmanCharacter: React.FC<StickmanCharacterProps> = ({ player, cameraOffset }) => {
  const { position, size, state, facingDirection } = player;
  
  // Calculate position relative to camera
  const displayX = position.x - cameraOffset.x;
  const displayY = position.y;
  
  // Apply animations based on player state
  const getAnimationClass = () => {
    switch (state) {
      case 'idle':
        return 'animate-idle';
      case 'running':
        return 'animate-run';
      case 'jumping':
        return 'animate-jump';
      case 'falling':
        return 'animate-fall';
      case 'wallSliding':
        return 'animate-wall-slide';
      case 'dead':
        return 'animate-dead';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`absolute ${getAnimationClass()}`}
      style={{
        left: `${displayX}px`,
        top: `${displayY}px`,
        width: `${size.x}px`,
        height: `${size.y}px`,
        transform: `scaleX(${facingDirection === 'left' ? -1 : 1})`,
        transformOrigin: 'center',
        transition: 'transform 0.1s ease-out'
      }}
    >
      <div className="relative w-full h-full">
        {/* Head with more details */}
        <div className="absolute bg-white rounded-full w-[35%] h-[25%] left-[32.5%] top-[2%]">
          {/* Eyes with blinking animation */}
          <div className="absolute bg-black w-[15%] h-[15%] rounded-full left-[25%] top-[40%] animate-blink"></div>
          <div className="absolute bg-black w-[15%] h-[15%] rounded-full right-[25%] top-[40%] animate-blink"></div>
          {/* Simple expression line */}
          <div className={`absolute w-[30%] h-[2px] bg-black left-[35%] ${
            state === 'jumping' ? 'top-[60%]' : 
            state === 'falling' ? 'top-[70%]' : 
            'top-[65%]'
          }`}></div>
        </div>
        
        {/* Neck with better connection to body */}
        <div className="absolute bg-white w-[8%] h-[8%] left-[46%] top-[27%] rounded-full"></div>
        
        {/* Body with more dynamic shape */}
        <div className={`absolute bg-white w-[12%] h-[30%] left-[44%] top-[35%] rounded-full transform ${
          state === 'running' ? 'rotate-[5deg]' :
          state === 'jumping' ? '-rotate-[5deg]' :
          state === 'falling' ? 'rotate-[8deg]' :
          ''
        }`}></div>
        
        {/* Arms with improved joint movement */}
        <div className={`absolute top-[35%] left-[40%] origin-top transform-gpu ${
          state === 'running' ? 'animate-arm-swing' : 
          state === 'jumping' ? '-rotate-45' :
          state === 'falling' ? 'rotate-[30deg]' :
          state === 'wallSliding' ? 'rotate-[60deg]' :
          state === 'idle' ? '-rotate-[5deg]' : ''
        }`}>
          {/* Upper arm */}
          <div className="absolute bg-white w-[6px] h-[15px] rounded-full"></div>
          {/* Lower arm with elbow bend */}
          <div className={`absolute bg-white w-[5px] h-[12px] top-[14px] left-[0.5px] origin-top transform ${
            state === 'running' ? 'rotate-[15deg]' :
            state === 'jumping' ? 'rotate-[30deg]' :
            'rotate-[10deg]'
          } rounded-full`}></div>
        </div>
        
        <div className={`absolute top-[35%] right-[40%] origin-top transform-gpu ${
          state === 'running' ? 'animate-arm-swing-reverse' : 
          state === 'jumping' ? 'rotate-45' :
          state === 'falling' ? '-rotate-[30deg]' :
          state === 'wallSliding' ? 'rotate-[120deg]' :
          state === 'idle' ? 'rotate-[5deg]' : ''
        }`}>
          {/* Upper arm */}
          <div className="absolute bg-white w-[6px] h-[15px] rounded-full"></div>
          {/* Lower arm with elbow bend */}
          <div className={`absolute bg-white w-[5px] h-[12px] top-[14px] left-[0.5px] origin-top transform ${
            state === 'running' ? '-rotate-[15deg]' :
            state === 'jumping' ? '-rotate-[30deg]' :
            '-rotate-[10deg]'
          } rounded-full`}></div>
        </div>
        
        {/* Legs with improved joint movement */}
        <div className={`absolute top-[65%] left-[44%] origin-top transform-gpu ${
          state === 'running' ? 'animate-leg-swing' : 
          state === 'jumping' ? '-rotate-[30deg]' :
          state === 'falling' ? 'rotate-[15deg]' :
          state === 'wallSliding' ? 'rotate-[30deg]' :
          state === 'idle' ? '-rotate-[5deg]' : ''
        }`}>
          {/* Upper leg */}
          <div className="absolute bg-white w-[7px] h-[18px] rounded-full"></div>
          {/* Lower leg with knee bend */}
          <div className={`absolute bg-white w-[6px] h-[15px] top-[17px] left-[0.5px] origin-top transform ${
            state === 'running' ? 'rotate-[10deg]' :
            state === 'jumping' ? 'rotate-[45deg]' :
            'rotate-[5deg]'
          } rounded-full`}></div>
        </div>
        
        <div className={`absolute top-[65%] right-[44%] origin-top transform-gpu ${
          state === 'running' ? 'animate-leg-swing-reverse' : 
          state === 'jumping' ? 'rotate-[30deg]' :
          state === 'falling' ? '-rotate-[15deg]' :
          state === 'wallSliding' ? '-rotate-[30deg]' :
          state === 'idle' ? 'rotate-[5deg]' : ''
        }`}>
          {/* Upper leg */}
          <div className="absolute bg-white w-[7px] h-[18px] rounded-full"></div>
          {/* Lower leg with knee bend */}
          <div className={`absolute bg-white w-[6px] h-[15px] top-[17px] left-[0.5px] origin-top transform ${
            state === 'running' ? '-rotate-[10deg]' :
            state === 'jumping' ? '-rotate-[45deg]' :
            '-rotate-[5deg]'
          } rounded-full`}></div>
        </div>
      </div>
    </div>
  );
};

export default StickmanCharacter;