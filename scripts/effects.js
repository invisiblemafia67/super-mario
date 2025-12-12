// Marvel Heroes Arena - Effects Manager

class EffectsManager {
    constructor() {
        this.effects = [];
    }
    
    add(effect) {
        this.effects.push(effect);
    }
    
    update(deltaTime) {
        this.effects = this.effects.filter(effect => {
            effect.update(deltaTime);
            return !effect.finished;
        });
    }
    
    render(ctx) {
        this.effects.forEach(effect => {
            effect.render(ctx);
        });
    }
    
    clear() {
        this.effects = [];
    }
}

class Effect {
    constructor(x, y, duration = 1.0) {
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.time = 0;
        this.finished = false;
    }
    
    update(deltaTime) {
        this.time += deltaTime;
        if (this.time >= this.duration) {
            this.finished = true;
        }
    }
    
    render(ctx) {
        // Override in subclasses
    }
}

window.EffectsManager = EffectsManager;
window.Effect = Effect;
