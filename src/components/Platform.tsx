import React from 'react';
import { Platform as PlatformType } from '../types/game';

interface PlatformProps {
  platform: PlatformType;
  cameraOffset: { x: number; y: number };
}

const Platform: React.FC<PlatformProps> = ({ platform, cameraOffset }) => {
  const { position, size, type } = platform;
  
  // Calculate position relative to camera
  const displayX = position.x - cameraOffset.x;
  const displayY = position.y;
  
  // Determine platform style based on type
  const getPlatformStyle = () => {
    switch (type) {
      case 'normal':
        return 'bg-gray-800';
      case 'moving':
        return 'bg-blue-600 animate-pulse';
      case 'crumbling':
        return 'bg-orange-500 animate-crumble';
      case 'bouncy':
        return 'bg-green-500 animate-bounce-subtle';
      default:
        return 'bg-gray-800';
    }
  };

  return (
    <div
      className={`absolute ${getPlatformStyle()} rounded-md`}
      style={{
        left: `${displayX}px`,
        top: `${displayY}px`,
        width: `${size.x}px`,
        height: `${size.y}px`,
      }}
    >
      {/* Add texture detail based on platform type */}
      {type === 'bouncy' && (
        <div className="absolute inset-0 flex justify-around items-center">
          <div className="w-1 h-1 bg-green-300 rounded-full"></div>
          <div className="w-1 h-1 bg-green-300 rounded-full"></div>
          <div className="w-1 h-1 bg-green-300 rounded-full"></div>
        </div>
      )}
      {type === 'crumbling' && (
        <div className="absolute inset-0 flex justify-around items-center">
          <div className="w-full h-full bg-opacity-20 bg-orange-300 opacity-50 bg-[radial-gradient(circle,_transparent_20%,_#fff_20%,_#fff_80%,_transparent_80%,_transparent)] bg-[size:5px_5px]"></div>
        </div>
      )}
    </div>
  );
};

export default Platform;