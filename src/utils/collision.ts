import { GameObject } from '../types/game';

type CollisionSide = 'top' | 'bottom' | 'left' | 'right' | 'none';

interface CollisionResult {
  collided: boolean;
  side: CollisionSide;
}

export const checkCollision = (
  obj1: GameObject,
  obj2: GameObject
): CollisionResult => {
  // Check if objects are overlapping
  const overlapX = 
    obj1.position.x < obj2.position.x + obj2.size.x &&
    obj1.position.x + obj1.size.x > obj2.position.x;
    
  const overlapY = 
    obj1.position.y < obj2.position.y + obj2.size.y &&
    obj1.position.y + obj1.size.y > obj2.position.y;
    
  if (!overlapX || !overlapY) {
    return { collided: false, side: 'none' };
  }
  
  // Calculate overlap amounts
  const overlapRight = obj2.position.x + obj2.size.x - obj1.position.x;
  const overlapLeft = obj1.position.x + obj1.size.x - obj2.position.x;
  const overlapTop = obj1.position.y + obj1.size.y - obj2.position.y;
  const overlapBottom = obj2.position.y + obj2.size.y - obj1.position.y;
  
  // Find the minimum overlap to determine collision side
  const minOverlap = Math.min(overlapRight, overlapLeft, overlapTop, overlapBottom);
  
  let side: CollisionSide = 'none';
  
  if (minOverlap === overlapTop) {
    side = 'top';
  } else if (minOverlap === overlapBottom) {
    side = 'bottom';
  } else if (minOverlap === overlapLeft) {
    side = 'left';
  } else if (minOverlap === overlapRight) {
    side = 'right';
  }
  
  return { collided: true, side };
};