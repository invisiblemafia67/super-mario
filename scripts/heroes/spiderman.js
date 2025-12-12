// Marvel Heroes Arena - Spider-Man Hero

class SpiderMan extends Character {
    constructor(x, y, team, isPlayer = false) {
        super(x, y, team, isPlayer);
        
        // Spider-Man specific stats
        this.maxHealth = 80;
        this.health = this.maxHealth;
        this.speed = 250; // Fastest hero
        this.damage = 20;
        this.attackRange = 80;
        this.maxAttackCooldown = 0.6;
        
        // Visual
        this.icon = '🕷️';
        this.name = 'Spider-Man';
        
        // Initialize abilities
        this.initializeAbilities();
    }
    
    initializeAbilities() {
        this.abilities = [
            new WebShot(),
            new WebSwing(),
            new SpiderSense()
        ];
    }
}

class WebShot {
    constructor() {
        this.name = 'Web Shot';
        this.cooldown = 0;
        this.maxCooldown = 2.0;
        this.damage = 15;
        this.slowDuration = 3.0;
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }
    
    use(game, caster) {
        if (this.cooldown > 0) return false;
        
        this.cooldown = this.maxCooldown;
        
        const projectile = new WebProjectile(
            caster.x, caster.y, caster.facing, this.damage, caster.team, caster
        );
        game.addProjectile(projectile);
        
        console.log(`${caster.name} used Web Shot!`);
        return true;
    }
}

class WebSwing {
    constructor() {
        this.name = 'Web Swing';
        this.cooldown = 0;
        this.maxCooldown = 5.0;
        this.range = 200;
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }
    
    use(game, caster) {
        if (this.cooldown > 0) return false;
        
        this.cooldown = this.maxCooldown;
        
        // Quick dash towards mouse position
        const targetX = game.input.mouse.worldX;
        const targetY = game.input.mouse.worldY;
        const angle = Utils.angle(caster.x, caster.y, targetX, targetY);
        
        caster.velocity.x = Math.cos(angle) * 400;
        caster.velocity.y = Math.sin(angle) * 400;
        
        console.log(`${caster.name} used Web Swing!`);
        return true;
    }
}

class SpiderSense {
    constructor() {
        this.name = 'Spider Sense';
        this.cooldown = 0;
        this.maxCooldown = 15.0;
        this.duration = 5.0;
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }
    
    use(game, caster) {
        if (this.cooldown > 0) return false;
        
        this.cooldown = this.maxCooldown;
        
        // Temporary speed boost and damage reduction
        const originalSpeed = caster.speed;
        caster.speed *= 1.5;
        
        setTimeout(() => {
            caster.speed = originalSpeed;
        }, this.duration * 1000);
        
        console.log(`${caster.name} used Spider Sense!`);
        return true;
    }
}

class WebProjectile extends Projectile {
    constructor(x, y, angle, damage, team, owner) {
        super(x, y, angle, damage, team, owner);
        this.speed = 400;
        this.color = '#ffffff';
        this.radius = 3;
        this.lifetime = 2.0;
    }
    
    update(deltaTime, game) {
        super.update(deltaTime, game);
        
        // Override collision to add slow effect
        if (!this.destroyed) {
            game.players.forEach(player => {
                if (player.team !== this.team && 
                    Utils.distance(this.x, this.y, player.x, player.y) < player.radius) {
                    
                    // Hit player
                    player.takeDamage(this.damage, this.owner, game);
                    
                    // Apply slow effect
                    const originalSpeed = player.speed;
                    player.speed *= 0.5;
                    
                    setTimeout(() => {
                        player.speed = originalSpeed;
                    }, 3000);
                    
                    this.destroyed = true;
                }
            });
        }
    }
}

window.SpiderMan = SpiderMan;
