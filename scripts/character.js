// Marvel Heroes Arena - Character System

class Character {
    constructor(x, y, team, isPlayer = false) {
        this.x = x;
        this.y = y;
        this.team = team;
        this.isPlayer = isPlayer;
        
        // Basic stats
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.speed = 200;
        this.radius = 20;
        
        // Movement
        this.velocity = { x: 0, y: 0 };
        this.facing = 0; // angle in radians
        
        // Combat
        this.damage = 25;
        this.attackRange = 100;
        this.attackCooldown = 0;
        this.maxAttackCooldown = 1.0;
        
        // Abilities
        this.abilities = [];
        
        // Visual
        this.icon = '🤖';
        this.color = team === 'blue' ? '#4ecdc4' : '#ff6b6b';
        
        // Stats
        this.eliminations = 0;
        this.deaths = 0;
        
        // AI reference
        this.ai = null;
    }
    
    update(deltaTime, game) {
        // Update cooldowns
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        
        // Update abilities
        this.abilities.forEach(ability => {
            ability.update(deltaTime);
        });
        
        // Handle input (player) or AI
        if (this.isPlayer) {
            this.handlePlayerInput(game);
        } else if (this.ai) {
            this.ai.update(deltaTime, game);
        }
        
        // Apply movement
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        
        // Apply friction
        this.velocity.x *= 0.9;
        this.velocity.y *= 0.9;
    }
    
    handlePlayerInput(game) {
        const input = game.input;
        
        // Movement
        const movement = input.getMovementVector();
        this.velocity.x = movement.x * this.speed;
        this.velocity.y = movement.y * this.speed;
        
        // Facing direction (towards mouse)
        this.facing = input.getMouseAngle(this.x, this.y);
        
        // Attacks
        if (input.isMouseDown('left') && this.attackCooldown <= 0) {
            this.attack(game);
        }
        
        // Abilities
        if (input.isKeyPressed('KeyQ')) {
            this.useAbility(0, game);
        }
        if (input.isKeyPressed('KeyE')) {
            this.useAbility(1, game);
        }
        if (input.isKeyPressed('KeyR')) {
            this.useAbility(2, game);
        }
    }
    
    attack(game) {
        this.attackCooldown = this.maxAttackCooldown;
        
        // Create projectile
        const projectile = new Projectile(
            this.x, this.y,
            this.facing,
            this.damage,
            this.team,
            this
        );
        
        game.addProjectile(projectile);
        
        // Play sound
        game.audio.playSound('shoot');
    }
    
    useAbility(index, game) {
        if (this.abilities[index]) {
            this.abilities[index].use(game, this);
        }
    }
    
    takeDamage(damage, attacker, game) {
        this.health -= damage;
        
        // Show damage number
        if (game && game.hud) {
            const screenPos = Utils.worldToScreen(this.x, this.y, game.camera);
            game.hud.showDamageNumber(screenPos.x, screenPos.y, damage);
        }
        
        // Check if dead
        if (this.health <= 0) {
            this.die(attacker, game);
        }
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    die(killer, game) {
        this.health = 0;
        this.deaths++;
        
        if (killer && killer !== this) {
            killer.eliminations++;
        }
        
        // Respawn after delay
        setTimeout(() => {
            this.respawn(game);
        }, 3000);
        
        console.log(`${this.constructor.name} (${this.team}) was eliminated!`);
    }
    
    respawn(game) {
        this.health = this.maxHealth;
        
        // Find spawn position
        const spawnX = this.team === 'blue' ? 
            game.worldWidth * 0.2 : game.worldWidth * 0.8;
        const spawnY = game.worldHeight * 0.5 + Utils.random(-100, 100);
        
        this.x = spawnX;
        this.y = spawnY;
        
        console.log(`${this.constructor.name} (${this.team}) respawned!`);
    }
    
    getDistanceTo(target) {
        return Utils.distance(this.x, this.y, target.x, target.y);
    }
    
    getAngleTo(target) {
        return Utils.angle(this.x, this.y, target.x, target.y);
    }
}

// Projectile class
class Projectile {
    constructor(x, y, angle, damage, team, owner) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.damage = damage;
        this.team = team;
        this.owner = owner;
        
        this.speed = 500;
        this.radius = 3;
        this.color = '#ffd700';
        this.destroyed = false;
        this.lifetime = 2.0;
        this.age = 0;
        
        // Calculate velocity
        this.velocity = {
            x: Math.cos(angle) * this.speed,
            y: Math.sin(angle) * this.speed
        };
    }
    
    update(deltaTime, game) {
        this.age += deltaTime;
        
        // Move
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        
        // Check lifetime
        if (this.age >= this.lifetime) {
            this.destroyed = true;
            return;
        }
        
        // Check world bounds
        if (this.x < 0 || this.x > game.worldWidth || 
            this.y < 0 || this.y > game.worldHeight) {
            this.destroyed = true;
            return;
        }
        
        // Check collisions with players
        game.players.forEach(player => {
            if (player.team !== this.team && 
                Utils.distance(this.x, this.y, player.x, player.y) < player.radius) {
                
                // Hit player
                player.takeDamage(this.damage, this.owner, game);
                this.destroyed = true;
            }
        });
    }
}

// Control Point class
class ControlPoint {
    constructor(x, y, label) {
        this.x = x;
        this.y = y;
        this.label = label;
        this.radius = 50;
        this.controlledBy = null;
        this.captureProgress = 0;
        this.captureRate = 1.0; // per second
    }
    
    update(deltaTime, players) {
        const playersInRange = players.filter(player => 
            Utils.distance(this.x, this.y, player.x, player.y) <= this.radius
        );
        
        const blueCount = playersInRange.filter(p => p.team === 'blue').length;
        const redCount = playersInRange.filter(p => p.team === 'red').length;
        
        if (blueCount > redCount) {
            this.captureProgress += deltaTime * this.captureRate;
            if (this.captureProgress >= 1.0) {
                this.controlledBy = 'blue';
                this.captureProgress = 1.0;
            }
        } else if (redCount > blueCount) {
            this.captureProgress -= deltaTime * this.captureRate;
            if (this.captureProgress <= -1.0) {
                this.controlledBy = 'red';
                this.captureProgress = -1.0;
            }
        }
        
        // Neutral state
        if (this.captureProgress > -0.1 && this.captureProgress < 0.1) {
            this.controlledBy = null;
        }
    }
}

// Powerup class
class Powerup {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.active = true;
        this.respawnTime = 30; // seconds
        this.respawnTimer = 0;
        
        const types = {
            health: { icon: '❤️', color: '#ff6b6b' },
            ability: { icon: '⚡', color: '#4ecdc4' },
            damage: { icon: '💥', color: '#ffd700' }
        };
        
        this.icon = types[type]?.icon || '⚡';
        this.color = types[type]?.color || '#ffd700';
    }
    
    update(deltaTime, players) {
        if (!this.active) {
            this.respawnTimer -= deltaTime;
            if (this.respawnTimer <= 0) {
                this.active = true;
            }
            return;
        }
        
        // Check for pickup
        players.forEach(player => {
            if (Utils.distance(this.x, this.y, player.x, player.y) <= 25) {
                this.pickup(player);
            }
        });
    }
    
    pickup(player) {
        this.active = false;
        this.respawnTimer = this.respawnTime;
        
        switch (this.type) {
            case 'health':
                player.heal(50);
                break;
            case 'ability':
                // Reduce ability cooldowns
                break;
            case 'damage':
                // Temporary damage boost
                break;
        }
        
        console.log(`${player.constructor.name} picked up ${this.type} powerup`);
    }
}

// AI Controller placeholder
class AIController {
    constructor(character, game) {
        this.character = character;
        this.game = game;
        this.target = null;
        this.lastTargetUpdate = 0;
    }
    
    update(deltaTime, game) {
        // Simple AI: find nearest enemy and attack
        this.lastTargetUpdate += deltaTime;
        
        if (this.lastTargetUpdate >= 0.5) { // Update target every 0.5 seconds
            this.findTarget(game);
            this.lastTargetUpdate = 0;
        }
        
        if (this.target) {
            this.moveTowardsTarget();
            this.attackTarget(game);
        }
    }
    
    findTarget(game) {
        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        game.players.forEach(player => {
            if (player.team !== this.character.team && player.health > 0) {
                const distance = this.character.getDistanceTo(player);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestEnemy = player;
                }
            }
        });
        
        this.target = nearestEnemy;
    }
    
    moveTowardsTarget() {
        if (!this.target) return;
        
        const angle = this.character.getAngleTo(this.target);
        const distance = this.character.getDistanceTo(this.target);
        
        if (distance > this.character.attackRange * 0.8) {
            this.character.velocity.x = Math.cos(angle) * this.character.speed;
            this.character.velocity.y = Math.sin(angle) * this.character.speed;
        } else {
            this.character.velocity.x *= 0.5;
            this.character.velocity.y *= 0.5;
        }
        
        this.character.facing = angle;
    }
    
    attackTarget(game) {
        if (!this.target || this.character.attackCooldown > 0) return;
        
        const distance = this.character.getDistanceTo(this.target);
        if (distance <= this.character.attackRange) {
            this.character.attack(game);
        }
    }
}

// Game Mode placeholder
class ControlPointMode {
    constructor(game) {
        this.game = game;
        this.scoreLimit = 3;
        this.lastScoreUpdate = 0;
    }
    
    init() {
        console.log('Control Point mode initialized');
    }
    
    update(deltaTime) {
        this.lastScoreUpdate += deltaTime;
        
        if (this.lastScoreUpdate >= 1.0) { // Update score every second
            this.updateScore();
            this.lastScoreUpdate = 0;
        }
    }
    
    updateScore() {
        const controlledPoints = this.game.objectives.filter(obj => obj.controlledBy);
        
        controlledPoints.forEach(point => {
            if (point.controlledBy === 'blue') {
                this.game.teams.blue.score += 0.1;
            } else if (point.controlledBy === 'red') {
                this.game.teams.red.score += 0.1;
            }
        });
        
        // Round scores
        this.game.teams.blue.score = Math.round(this.game.teams.blue.score * 10) / 10;
        this.game.teams.red.score = Math.round(this.game.teams.red.score * 10) / 10;
    }
}

// Export classes
window.Character = Character;
window.Projectile = Projectile;
window.ControlPoint = ControlPoint;
window.Powerup = Powerup;
window.AIController = AIController;
window.ControlPointMode = ControlPointMode;
