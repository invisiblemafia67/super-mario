// Marvel Heroes Arena - Captain America Hero

class CaptainAmerica extends Character {
    constructor(x, y, team, isPlayer = false) {
        super(x, y, team, isPlayer);
        
        // Captain America specific stats
        this.maxHealth = 150; // Tankiest hero
        this.health = this.maxHealth;
        this.speed = 160;
        this.damage = 25;
        this.attackRange = 90;
        this.maxAttackCooldown = 1.0;
        
        // Visual
        this.icon = '🛡️';
        this.name = 'Captain America';
        
        // Initialize abilities
        this.initializeAbilities();
    }
    
    initializeAbilities() {
        this.abilities = [
            new ShieldThrow(),
            new ShieldBlock(),
            new RallyingCry()
        ];
    }
}

class ShieldThrow {
    constructor() {
        this.name = 'Shield Throw';
        this.cooldown = 0;
        this.maxCooldown = 4.0;
        this.damage = 35;
        this.bounces = 2;
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }
    
    use(game, caster) {
        if (this.cooldown > 0) return false;
        
        this.cooldown = this.maxCooldown;
        
        const projectile = new ShieldProjectile(
            caster.x, caster.y, caster.facing, this.damage, caster.team, caster, this.bounces
        );
        game.addProjectile(projectile);
        
        console.log(`${caster.name} used Shield Throw!`);
        return true;
    }
}

class ShieldBlock {
    constructor() {
        this.name = 'Shield Block';
        this.cooldown = 0;
        this.maxCooldown = 8.0;
        this.duration = 3.0;
        this.damageReduction = 0.7; // 70% damage reduction
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }
    
    use(game, caster) {
        if (this.cooldown > 0) return false;
        
        this.cooldown = this.maxCooldown;
        
        // Add damage reduction effect
        caster.isBlocking = true;
        caster.damageReduction = this.damageReduction;
        
        setTimeout(() => {
            caster.isBlocking = false;
            caster.damageReduction = 0;
        }, this.duration * 1000);
        
        console.log(`${caster.name} used Shield Block!`);
        return true;
    }
}

class RallyingCry {
    constructor() {
        this.name = 'Rallying Cry';
        this.cooldown = 0;
        this.maxCooldown = 20.0;
        this.healAmount = 30;
        this.range = 150;
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }
    
    use(game, caster) {
        if (this.cooldown > 0) return false;
        
        this.cooldown = this.maxCooldown;
        
        // Heal nearby teammates
        game.players.forEach(player => {
            if (player.team === caster.team && 
                Utils.distance(caster.x, caster.y, player.x, player.y) <= this.range) {
                player.heal(this.healAmount);
                
                // Visual effect
                const healEffect = new HealEffect(player.x, player.y);
                game.addEffect(healEffect);
            }
        });
        
        console.log(`${caster.name} used Rallying Cry!`);
        return true;
    }
}

class ShieldProjectile extends Projectile {
    constructor(x, y, angle, damage, team, owner, bounces) {
        super(x, y, angle, damage, team, owner);
        this.speed = 350;
        this.color = '#4169E1';
        this.radius = 8;
        this.lifetime = 4.0;
        this.bouncesLeft = bounces;
        this.hitTargets = new Set();
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
        
        // Check world bounds - bounce off walls
        if (this.x <= 0 || this.x >= game.worldWidth) {
            this.velocity.x *= -1;
            this.bouncesLeft--;
        }
        if (this.y <= 0 || this.y >= game.worldHeight) {
            this.velocity.y *= -1;
            this.bouncesLeft--;
        }
        
        if (this.bouncesLeft < 0) {
            this.destroyed = true;
            return;
        }
        
        // Check collisions with players
        game.players.forEach(player => {
            if (player.team !== this.team && 
                !this.hitTargets.has(player) &&
                Utils.distance(this.x, this.y, player.x, player.y) < player.radius) {
                
                // Hit player
                player.takeDamage(this.damage, this.owner, game);
                this.hitTargets.add(player);
                
                // Bounce towards another enemy if available
                this.findNextTarget(game);
            }
        });
    }
    
    findNextTarget(game) {
        if (this.bouncesLeft <= 0) return;
        
        let nearestEnemy = null;
        let nearestDistance = Infinity;
        
        game.players.forEach(player => {
            if (player.team !== this.team && !this.hitTargets.has(player)) {
                const distance = Utils.distance(this.x, this.y, player.x, player.y);
                if (distance < nearestDistance && distance <= 200) {
                    nearestDistance = distance;
                    nearestEnemy = player;
                }
            }
        });
        
        if (nearestEnemy) {
            const angle = Utils.angle(this.x, this.y, nearestEnemy.x, nearestEnemy.y);
            this.velocity.x = Math.cos(angle) * this.speed;
            this.velocity.y = Math.sin(angle) * this.speed;
            this.bouncesLeft--;
        }
    }
}

class HealEffect extends Effect {
    constructor(x, y) {
        super(x, y, 1.0);
        this.startY = y;
    }
    
    render(ctx) {
        const progress = this.time / this.duration;
        const alpha = 1 - progress;
        const currentY = this.startY - progress * 30;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#4ecdc4';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('+30', this.x, currentY);
        ctx.restore();
    }
}

window.CaptainAmerica = CaptainAmerica;
