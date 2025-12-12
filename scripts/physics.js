// Marvel Heroes Arena - Physics System

class Physics {
    constructor() {
        this.gravity = 0; // No gravity for top-down game
        this.friction = 0.8;
    }
    
    update(entities, deltaTime) {
        entities.forEach(entity => {
            if (entity.velocity) {
                // Apply velocity
                entity.x += entity.velocity.x * deltaTime;
                entity.y += entity.velocity.y * deltaTime;
                
                // Apply friction
                entity.velocity.x *= this.friction;
                entity.velocity.y *= this.friction;
            }
        });
    }
    
    checkCollision(entity1, entity2) {
        const dx = entity1.x - entity2.x;
        const dy = entity1.y - entity2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = (entity1.radius || 20) + (entity2.radius || 20);
        
        return distance < minDistance;
    }
}

window.Physics = Physics;
