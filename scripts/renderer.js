// Marvel Heroes Arena - Renderer System

class Renderer {
    constructor(ctx, minimapCtx) {
        this.ctx = ctx;
        this.minimapCtx = minimapCtx;
    }
    
    renderCharacter(character) {
        const ctx = this.ctx;
        
        // Save context
        ctx.save();
        
        // Draw character circle
        ctx.fillStyle = character.team === 'blue' ? '#4ecdc4' : '#ff6b6b';
        ctx.beginPath();
        ctx.arc(character.x, character.y, character.radius || 20, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw character icon
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(character.icon || '🤖', character.x, character.y);
        
        // Draw health bar
        if (character.health < character.maxHealth) {
            const barWidth = 40;
            const barHeight = 6;
            const barX = character.x - barWidth / 2;
            const barY = character.y - (character.radius || 20) - 15;
            
            // Background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Health
            const healthPercent = character.health / character.maxHealth;
            ctx.fillStyle = healthPercent > 0.5 ? '#4ecdc4' : '#ff6b6b';
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        }
        
        // Restore context
        ctx.restore();
    }
    
    renderProjectile(projectile) {
        const ctx = this.ctx;
        
        ctx.save();
        ctx.fillStyle = projectile.color || '#ffd700';
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, projectile.radius || 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    renderObjective(objective) {
        const ctx = this.ctx;
        
        ctx.save();
        
        // Draw objective area
        ctx.fillStyle = objective.controlledBy === 'blue' ? 'rgba(78, 205, 196, 0.3)' :
                       objective.controlledBy === 'red' ? 'rgba(255, 107, 107, 0.3)' :
                       'rgba(255, 215, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(objective.x, objective.y, objective.radius || 50, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw objective border
        ctx.strokeStyle = objective.controlledBy === 'blue' ? '#4ecdc4' :
                         objective.controlledBy === 'red' ? '#ff6b6b' : '#ffd700';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw objective label
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(objective.label || 'A', objective.x, objective.y);
        
        ctx.restore();
    }
    
    renderPowerup(powerup) {
        const ctx = this.ctx;
        
        if (!powerup.active) return;
        
        ctx.save();
        
        // Draw powerup glow
        const time = Date.now() * 0.005;
        const glowRadius = 15 + Math.sin(time) * 3;
        
        const gradient = ctx.createRadialGradient(
            powerup.x, powerup.y, 0,
            powerup.x, powerup.y, glowRadius
        );
        gradient.addColorStop(0, powerup.color || '#ffd700');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(powerup.x, powerup.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw powerup icon
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(powerup.icon || '⚡', powerup.x, powerup.y);
        
        ctx.restore();
    }
}

window.Renderer = Renderer;
