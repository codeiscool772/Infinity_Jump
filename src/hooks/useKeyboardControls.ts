import { useState, useEffect } from 'react';

export const useKeyboardControls = () => {
  const [keys, setKeys] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setKeys((keys) => ({ ...keys, moveForward: true }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setKeys((keys) => ({ ...keys, moveBackward: true }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setKeys((keys) => ({ ...keys, moveLeft: true }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setKeys((keys) => ({ ...keys, moveRight: true }));
          break;
        case 'Space':
          setKeys((keys) => ({ ...keys, jump: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          setKeys((keys) => ({ ...keys, moveForward: false }));
          break;
        case 'KeyS':
        case 'ArrowDown':
          setKeys((keys) => ({ ...keys, moveBackward: false }));
          break;
        case 'KeyA':
        case 'ArrowLeft':
          setKeys((keys) => ({ ...keys, moveLeft: false }));
          break;
        case 'KeyD':
        case 'ArrowRight':
          setKeys((keys) => ({ ...keys, moveRight: false }));
          break;
        case 'Space':
          setKeys((keys) => ({ ...keys, jump: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
};