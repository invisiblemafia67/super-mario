// Marvel Heroes Arena - Iron Man Hero

class IronMan extends Character {
    constructor(x, y, team, isPlayer = false) {
        super(x, y, team, isPlayer);
        
        // Iron Man specific stats
        this.maxHealth = 120;
        this.health = this.maxHealth;
        this.speed = 180;
        this.damage = 30;
        this.attackRange = 150;
        this.maxAttackCooldown = 0.8;
        
        // Visual
        this.icon = '🤖';
        this.name = 'Iron Man';
        
        // Initialize abilities
        this.initializeAbilities();
    }
    
    initializeAbilities() {
        this.abilities = [
            new RepulsorBlast(),
            new MissileSalvo(),
            new UltimateBeam()
        ];
    }
}

// Iron Man Abilities
class RepulsorBlast {
    constructor() {
        this.name = 'Repulsor Blast';
        this.cooldown = 0;
        this.maxCooldown = 3.0;
        this.damage = 40;
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
        
        // Create multiple projectiles in a spread
        const spreadAngle = Math.PI / 6; // 30 degrees
        const projectileCount = 3;
        
        for (let i = 0; i < projectileCount; i++) {
            const angle = caster.facing + (i - 1) * (spreadAngle / 2);
            const projectile = new RepulsorProjectile(
                caster.x, caster.y, angle, this.damage, caster.team, caster
            );
            game.addProjectile(projectile);
        }
        
        game.audio.playSound('repulsor');
        console.log(`${caster.name} used Repulsor Blast!`);
        return true;
    }
}

class MissileSalvo {
    constructor() {
        this.name = 'Missile Salvo';
        this.cooldown = 0;
        this.maxCooldown = 8.0;
        this.damage = 25;
        this.missileCount = 5;
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }
    
    use(game, caster) {
        if (this.cooldown > 0) return false;
        
        this.cooldown = this.maxCooldown;
        
        // Launch missiles with slight delays
        for (let i = 0; i < this.missileCount; i++) {
            setTimeout(() => {
                const angle = caster.facing + Utils.random(-0.3, 0.3);
                const missile = new MissileProjectile(
                    caster.x, caster.y, angle, this.damage, caster.team, caster
                );
                game.addProjectile(missile);
            }, i * 100);
        }
        
        game.audio.playSound('missile');
        console.log(`${caster.name} used Missile Salvo!`);
        return true;
    }
}

class UltimateBeam {
    constructor() {
        this.name = 'Unibeam';
        this.cooldown = 0;
        this.maxCooldown = 20.0;
        this.damage = 100;
        this.range = 300;
        this.width = 40;
    }
    
    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
    }
    
    use(game, caster) {
        if (this.cooldown > 0) return false;
        
        this.cooldown = this.maxCooldown;
        
        // Create beam effect
        const beam = new BeamEffect(
            caster.x, caster.y, caster.facing, this.range, this.width, this.damage, caster.team, caster
        );
        
        game.addEffect(beam);
        game.audio.playSound('unibeam');
        console.log(`${caster.name} used Unibeam!`);
        return true;
    }
}

// Iron Man Projectiles
class RepulsorProjectile extends Projectile {
    constructor(x, y, angle, damage, team, owner) {
        super(x, y, angle, damage, team, owner);
        this.speed = 600;
        this.color = '#00ffff';
        this.radius = 4;
        this.lifetime = 1.5;
    }
}

class MissileProjectile extends Projectile {
    constructor(x, y, angle, damage, team, owner) {
        super(x, y, angle, damage, team, owner);
        this.speed = 400;
        this.color = '#ff4444';
        this.radius = 5;
        this.lifetime = 3.0;
        this.explosionRadius = 30;
    }
    
    update(deltaTime, game) {
        super.update(deltaTime, game);
        
        // Add explosion on impact
        if (this.destroyed && this.age < this.lifetime) {
            this.explode(game);
        }
    }
    
    explode(game) {
        // Damage all players in explosion radius
        game.players.forEach(player => {
            const distance = Utils.distance(this.x, this.y, player.x, player.y);
            if (distance <= this.explosionRadius && player.team !== this.team) {
                const explosionDamage = this.damage * (1 - distance / this.explosionRadius);
                player.takeDamage(explosionDamage, this.owner, game);
            }
        });
        
        // Create explosion effect
        const explosion = new ExplosionEffect(this.x, this.y, this.explosionRadius);
        game.addEffect(explosion);
    }
}

// Iron Man Effects
class BeamEffect extends Effect {
    constructor(x, y, angle, range, width, damage, team, caster) {
        super(x, y, 0.5); // 0.5 second duration
        this.angle = angle;
        this.range = range;
        this.width = width;
        this.damage = damage;
        this.team = team;
        this.caster = caster;
        this.hasDealtDamage = false;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Deal damage once when beam fires
        if (!this.hasDealtDamage) {
            this.dealDamage();
            this.hasDealtDamage = true;
        }
    }
    
    dealDamage() {
        // Check for players in beam path
        const endX = this.x + Math.cos(this.angle) * this.range;
        const endY = this.y + Math.sin(this.angle) * this.range;
        
        window.game.players.forEach(player => {
            if (player.team === this.team) return;
            
            // Check if player is in beam path (simplified)
            const distanceToLine = this.distanceToLine(player.x, player.y, this.x, this.y, endX, endY);
            if (distanceToLine <= this.width / 2) {
                player.takeDamage(this.damage, this.caster, window.game);
            }
        });
    }
    
    distanceToLine(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        if (lenSq === 0) return Math.sqrt(A * A + B * B);
        
        const param = dot / lenSq;
        
        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
        
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    render(ctx) {
        const alpha = 1 - (this.time / this.duration);
        const endX = this.x + Math.cos(this.angle) * this.range;
        const endY = this.y + Math.sin(this.angle) * this.range;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 20;
        ctx.stroke();
        
        ctx.restore();
    }
}

class ExplosionEffect extends Effect {
    constructor(x, y, radius) {
        super(x, y, 0.3);
        this.maxRadius = radius;
    }
    
    render(ctx) {
        const progress = this.time / this.duration;
        const currentRadius = this.maxRadius * progress;
        const alpha = 1 - progress;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Outer explosion
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner explosion
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

window.IronMan = IronMan;
