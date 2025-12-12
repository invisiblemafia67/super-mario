// Marvel Heroes Arena - HUD Manager

class HUDManager {
    constructor() {
        this.elements = {};
    }
    
    init() {
        this.elements = {
            healthBar: document.getElementById('healthBar'),
            healthText: document.getElementById('healthText'),
            playerHeroIcon: document.getElementById('playerHeroIcon'),
            gameTimer: document.getElementById('gameTimer'),
            blueScore: document.getElementById('blueScore'),
            redScore: document.getElementById('redScore'),
            ability1: document.getElementById('ability1'),
            ability2: document.getElementById('ability2'),
            ultimate: document.getElementById('ultimate'),
            cooldown1: document.getElementById('cooldown1'),
            cooldown2: document.getElementById('cooldown2'),
            cooldownUlt: document.getElementById('cooldownUlt')
        };
        console.log('HUD Manager initialized');
    }
    
    update(player, gameTime, matchDuration, teams) {
        if (!player) return;
        
        // Update health
        this.updateHealth(player.health, player.maxHealth);
        
        // Update timer
        this.updateTimer(matchDuration - gameTime);
        
        // Update scores
        this.updateScores(teams);
        
        // Update abilities
        this.updateAbilities(player);
    }
    
    updateHealth(health, maxHealth) {
        const healthPercent = (health / maxHealth) * 100;
        if (this.elements.healthBar) {
            this.elements.healthBar.style.width = healthPercent + '%';
        }
        if (this.elements.healthText) {
            this.elements.healthText.textContent = `${Math.round(health)}/${maxHealth}`;
        }
    }
    
    updateTimer(timeLeft) {
        if (this.elements.gameTimer) {
            this.elements.gameTimer.textContent = Utils.formatTime(Math.max(0, timeLeft));
        }
    }
    
    updateScores(teams) {
        if (this.elements.blueScore) {
            this.elements.blueScore.textContent = teams.blue.score;
        }
        if (this.elements.redScore) {
            this.elements.redScore.textContent = teams.red.score;
        }
    }
    
    updateAbilities(player) {
        // Update ability cooldowns (placeholder)
        const abilities = ['ability1', 'ability2', 'ultimate'];
        abilities.forEach((abilityName, index) => {
            const element = this.elements[abilityName];
            const cooldownElement = this.elements[`cooldown${index === 2 ? 'Ult' : index + 1}`];
            
            if (element && cooldownElement) {
                // Placeholder cooldown logic
                const isOnCooldown = false; // player.abilities[index]?.onCooldown
                
                if (isOnCooldown) {
                    element.classList.add('on-cooldown');
                    cooldownElement.textContent = '3'; // placeholder
                } else {
                    element.classList.remove('on-cooldown');
                    element.classList.add('ready');
                    cooldownElement.textContent = '';
                }
            }
        });
    }
    
    updateHeroIcon(heroType) {
        const icons = {
            'ironman': '🤖',
            'spiderman': '🕷️',
            'captain-america': '🛡️',
            'thor': '⚡'
        };
        
        if (this.elements.playerHeroIcon) {
            this.elements.playerHeroIcon.textContent = icons[heroType] || '🤖';
        }
    }
    
    toggleScoreboard() {
        // Placeholder for scoreboard toggle
        console.log('Toggling scoreboard');
    }
    
    showDamageNumber(x, y, damage, isCritical = false) {
        const damageElement = document.createElement('div');
        damageElement.className = `damage-number ${isCritical ? 'critical' : ''}`;
        damageElement.textContent = Math.round(damage);
        damageElement.style.left = x + 'px';
        damageElement.style.top = y + 'px';
        
        document.body.appendChild(damageElement);
        
        setTimeout(() => {
            damageElement.remove();
        }, 1000);
    }
}

window.HUDManager = HUDManager;
