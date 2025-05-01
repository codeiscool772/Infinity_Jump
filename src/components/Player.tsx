import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useKeyboardControls } from '../hooks/useKeyboardControls';

interface PlayerProps {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  onMove: (position: Vector3, velocity: Vector3) => void;
}

export const Player: React.FC<PlayerProps> = ({ position, rotation, onMove }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocityRef = useRef(new Vector3());
  const { moveForward, moveBackward, moveLeft, moveRight, jump } = useKeyboardControls();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(position.x, position.y, position.z);
    }
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const speed = 5;
    const direction = new Vector3();
    const frontVector = new Vector3(0, 0, 1).applyAxisAngle(new Vector3(0, 1, 0), rotation.y);
    const sideVector = new Vector3(1, 0, 0).applyAxisAngle(new Vector3(0, 1, 0), rotation.y);

    if (moveForward) direction.sub(frontVector);
    if (moveBackward) direction.add(frontVector);
    if (moveLeft) direction.sub(sideVector);
    if (moveRight) direction.add(sideVector);

    direction.normalize().multiplyScalar(speed * delta);
    velocityRef.current.add(direction);

    // Apply gravity
    velocityRef.current.y -= 9.8 * delta;

    // Apply velocity to position
    meshRef.current.position.add(velocityRef.current);

    // Ground check
    if (meshRef.current.position.y < 1) {
      meshRef.current.position.y = 1;
      velocityRef.current.y = 0;
      
      if (jump) {
        velocityRef.current.y = 5;
      }
    }

    // Air resistance
    velocityRef.current.multiplyScalar(0.95);

    // Update game state
    onMove(meshRef.current.position, velocityRef.current);
  });

  return (
    <mesh
      ref={meshRef}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
    >
      <capsuleGeometry args={[0.5, 1, 4]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};