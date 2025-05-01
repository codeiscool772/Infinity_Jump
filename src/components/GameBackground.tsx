import React from 'react';

interface GameBackgroundProps {
  cameraOffset: { x: number; y: number };
}

const GameBackground: React.FC<GameBackgroundProps> = ({ cameraOffset }) => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-gray-900 to-purple-900">
      {/* Far background layer - stars */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          backgroundPosition: `${-cameraOffset.x * 0.1}px 0px`,
        }}
      ></div>
      
      {/* Mid background layer - mountains */}
      <div 
        className="absolute bottom-0 w-screen h-1/3 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(135deg, transparent 75%, #6B46C1 75%), linear-gradient(225deg, transparent 75%, #6B46C1 75%), linear-gradient(45deg, transparent 75%, #6B46C1 75%), linear-gradient(315deg, transparent 75%, #6B46C1 75%)',
          backgroundSize: '100px 100px',
          backgroundPosition: `${-cameraOffset.x * 0.3}px 0px`,
        }}
      ></div>
      
      {/* Foreground layer - grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(200, 200, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 200, 255, 0.5) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: `${-cameraOffset.x * 0.8}px 0px`,
        }}
      ></div>
    </div>
  );
};

export default GameBackground;