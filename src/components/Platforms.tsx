import React from 'react';
import { Platform } from '../types/game';

interface PlatformsProps {
  platforms: Platform[];
  difficulty: number;
}

export const Platforms: React.FC<PlatformsProps> = ({ platforms, difficulty }) => {
  return (
    <group>
      {platforms.map((platform) => (
        <mesh
          key={platform.id}
          position={[platform.position.x, platform.position.y, 0]}
          receiveShadow
        >
          <boxGeometry args={[platform.size.x, platform.size.y, 20]} />
          <meshStandardMaterial 
            color={
              platform.type === 'normal' ? '#4a5568' :
              platform.type === 'moving' ? '#3182ce' :
              platform.type === 'crumbling' ? '#dd6b20' :
              '#48bb78' // bouncy
            }
          />
        </mesh>
      ))}
    </group>
  );
};