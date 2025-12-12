// Marvel Heroes Arena - Thor Hero

class Thor extends Character {
    constructor(x, y, team, isPlayer = false) {
        super(x, y, team, isPlayer);
        
        // Thor specific stats
        this.maxHealth = 180; // Highest health
        this.health = this.maxHealth;
        this.speed = 140; // Slowest but strongest
        this.damage = 40; // Highest base damage
        this.attackRange = 100;
        this.maxAttackCooldown = 1.2;
        
        // Visual
        this.icon = '⚡';
        this.name = 'Thor';
        
        // Initialize abilities
        this.initializeAbilities();
    }
    
    initializeAbilities() {
        this.abilities = [
            new LightningBolt(),
            new MjolnirThrow(),
            new Thunderstorm()
        ];
    }
}

class LightningBolt {
    constructor() {
        this.name = 'Lightning Bolt';
        this.cooldown = 0;
        this.maxCooldown = 3.0;
        this.damage = 50;
        this.range = 250;
        this.chainCount = 2;
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }
    
    use(game, caster) {
        if (this.cooldown > 0) return false;
        
        this.cooldown = this.maxCooldown;
        
        // Find target in range
        const targetX = game.input.mouse.worldX;
        const targetY = game.input.mouse.worldY;
        
        // Create lightning effect
        const lightning = new LightningEffect(
            caster.x, caster.y, targetX, targetY, this.damage, caster.team, caster, this.chainCount
        );
        game.addEffect(lightning);
        
        console.log(`${caster.name} used Lightning Bolt!`);
        return true;
    }
}

class MjolnirThrow {
    constructor() {
        this.name = 'Mjolnir Throw';
        this.cooldown = 0;
        this.maxCooldown = 6.0;
        this.damage = 60;
        this.knockbackForce = 200;
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }
    
    use(game, caster) {
        if (this.cooldown > 0) return false;
        
        this.cooldown = this.maxCooldown;
        
        const projectile = new MjolnirProjectile(
            caster.x, caster.y, caster.facing, this.damage, caster.team, caster
        );
        game.addProjectile(projectile);
        
        console.log(`${caster.name} used Mjolnir Throw!`);
        return true;
    }
}

class Thunderstorm {
    constructor() {
        this.name = 'Thunderstorm';
        this.cooldown = 0;
        this.maxCooldown = 25.0;
        this.damage = 30;
        this.duration = 5.0;
        this.radius = 200;
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }
    
    use(game, caster) {
        if (this.cooldown > 0) return false;
        
        this.cooldown = this.maxCooldown;
        
        // Create thunderstorm at caster's position
        const storm = new ThunderstormEffect(
            caster.x, caster.y, this.radius, this.duration, this.damage, caster.team, caster
        );
        game.addEffect(storm);
        
        console.log(`${caster.name} used Thunderstorm!`);
        return true;
    }
}

class MjolnirProjectile extends Projectile {
    constructor(x, y, angle, damage, team, owner) {
        super(x, y, angle, damage, team, owner);
        this.speed = 300;
        this.color = '#FFD700';
        this.radius = 10;
        this.lifetime = 3.0;
        this.returning = false;
        this.returnTime = 1.5;
    }
    
    update(deltaTime, game) {
        this.age += deltaTime;
        
        // Start returning after half the lifetime
        if (this.age >= this.returnTime && !this.returning) {
            this.returning = true;
            // Reverse direction towards owner
            const angle = Utils.angle(this.x, this.y, this.owner.x, this.owner.y);
            this.velocity.x = Math.cos(angle) * this.speed;
            this.velocity.y = Math.sin(angle) * this.speed;
        }
        
        // Move
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        
        // Check lifetime
        if (this.age >= this.lifetime) {
            this.destroyed = true;
            return;
        }
        
        // Check collisions with players
        game.players.forEach(player => {
            if (player.team !== this.team && 
                Utils.distance(this.x, this.y, player.x, player.y) < player.radius) {
                
                // Hit player
                player.takeDamage(this.damage, this.owner, game);
                
                // Apply knockback
                const knockbackAngle = Utils.angle(this.x, this.y, player.x, player.y);
                player.velocity.x += Math.cos(knockbackAngle) * 200;
                player.velocity.y += Math.sin(knockbackAngle) * 200;
                
                if (!this.returning) {
                    this.destroyed = true;
                }
            }
        });
    }
}

class LightningEffect extends Effect {
    constructor(x, y, targetX, targetY, damage, team, caster, chainCount) {
        super(x, y, 0.3);
        this.targetX = targetX;
        this.targetY = targetY;
        this.damage = damage;
        this.team = team;
        this.caster = caster;
        this.chainCount = chainCount;
        this.hasDealtDamage = false;
        this.chainTargets = [];
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        if (!this.hasDealtDamage) {
            this.dealDamage();
            this.hasDealtDamage = true;
        }
    }
    
    dealDamage() {
        // Find target at lightning position
        let hitTarget = null;
        let minDistance = 30; // Lightning strike radius
        
        window.game.players.forEach(player => {
            if (player.team === this.team) return;
            
            const distance = Utils.distance(this.targetX, this.targetY, player.x, player.y);
            if (distance < minDistance) {
                minDistance = distance;
                hitTarget = player;
            }
        });
        
        if (hitTarget) {
            hitTarget.takeDamage(this.damage, this.caster, window.game);
            this.chainTargets.push(hitTarget);
            
            // Chain to nearby enemies
            this.chainLightning(hitTarget);
        }
    }
    
    chainLightning(fromTarget) {
        if (this.chainCount <= 0) return;
        
        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        window.game.players.forEach(player => {
            if (player.team === this.team || this.chainTargets.includes(player)) return;
            
            const distance = Utils.distance(fromTarget.x, fromTarget.y, player.x, player.y);
            if (distance < nearestDistance && distance <= 150) {
                nearestDistance = distance;
                nearestEnemy = player;
            }
        });
        
        if (nearestEnemy) {
            nearestEnemy.takeDamage(this.damage * 0.7, this.caster, window.game);
            this.chainTargets.push(nearestEnemy);
            
            // Create chain effect
            const chainEffect = new ChainLightningEffect(
                fromTarget.x, fromTarget.y, nearestEnemy.x, nearestEnemy.y
            );
            window.game.addEffect(chainEffect);
            
            // Continue chaining
            this.chainCount--;
            this.chainLightning(nearestEnemy);
        }
    }
    
    render(ctx) {
        const alpha = 1 - (this.time / this.duration);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        
        // Draw jagged lightning bolt
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        
        const segments = 5;
        for (let i = 1; i <= segments; i++) {
            const progress = i / segments;
            const x = this.x + (this.targetX - this.x) * progress + Utils.random(-20, 20);
            const y = this.y + (this.targetY - this.y) * progress + Utils.random(-20, 20);
            ctx.lineTo(x, y);
        }
        
        ctx.stroke();
        
        // Add glow
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15;
        ctx.stroke();
        
        ctx.restore();
    }
}

class ChainLightningEffect extends Effect {
    constructor(x, y, targetX, targetY) {
        super(x, y, 0.2);
        this.targetX = targetX;
        this.targetY = targetY;
    }
    
    render(ctx) {
        const alpha = 1 - (this.time / this.duration);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#87CEEB';
        ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.targetX, this.targetY);
        ctx.stroke();
        
        ctx.restore();
    }
}

class ThunderstormEffect extends Effect {
    constructor(x, y, radius, duration, damage, team, caster) {
        super(x, y, duration);
        this.radius = radius;
        this.damage = damage;
        this.team = team;
        this.caster = caster;
        this.lastStrike = 0;
        this.strikeInterval = 0.5;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        this.lastStrike += deltaTime;
        if (this.lastStrike >= this.strikeInterval) {
            this.strikeRandomly();
            this.lastStrike = 0;
        }
    }
    
    strikeRandomly() {
        // Strike random position within storm
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * this.radius;
        const strikeX = this.x + Math.cos(angle) * distance;
        const strikeY = this.y + Math.sin(angle) * distance;
        
        // Check for enemies in strike area
        window.game.players.forEach(player => {
            if (player.team !== this.team && 
                Utils.distance(strikeX, strikeY, player.x, player.y) <= 25) {
                player.takeDamage(this.damage, this.caster, window.game);
            }
        });
        
        // Create lightning strike effect
        const strike = new LightningStrikeEffect(strikeX, strikeY);
        window.game.addEffect(strike);
    }
    
    render(ctx) {
        const alpha = 0.3 * (1 - this.time / this.duration);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#4B0082';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.restore();
    }
}

class LightningStrikeEffect extends Effect {
    constructor(x, y) {
        super(x, y, 0.1);
    }
    
    render(ctx) {
        ctx.save();
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 20;
        ctx.fill();
        
        ctx.restore();
    }
}

window.Thor = Thor;
