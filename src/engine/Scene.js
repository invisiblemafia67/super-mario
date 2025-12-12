/**
 * Super Mario Advanced - Scene Management
 * Manages game scenes and transitions
 */

export default class Scene {
    constructor(name) {
        this.name = name;
        this.entities = new Set();
        this.systems = new Map();
        this.isActive = false;
        this.isPaused = false;
        
        // Scene properties
        this.background = '#5C94FC';
        this.gravity = 980; // pixels per second squared
        this.bounds = {
            left: 0,
            right: 3200,
            top: 0,
            bottom: 576
        };
        
        console.log(`🎬 Scene '${name}' created`);
    }

    activate() {
        this.isActive = true;
        console.log(`🎬 Scene '${this.name}' activated`);
    }

    deactivate() {
        this.isActive = false;
        console.log(`🎬 Scene '${this.name}' deactivated`);
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    update(deltaTime) {
        if (!this.isActive || this.isPaused) return;
        
        // Update scene-specific logic here
        // Systems will be updated by the SystemManager
    }

    render(renderer) {
        if (!this.isActive) return;
        
        // Clear with scene background
        renderer.clear(this.background);
        
        // Scene-specific rendering will be handled by render systems
    }

    addEntity(entityId) {
        this.entities.add(entityId);
    }

    removeEntity(entityId) {
        this.entities.delete(entityId);
    }

    hasEntity(entityId) {
        return this.entities.has(entityId);
    }

    getEntities() {
        return Array.from(this.entities);
    }

    // Getters and setters
    setBackground(color) {
        this.background = color;
    }

    setGravity(gravity) {
        this.gravity = gravity;
    }

    setBounds(left, right, top, bottom) {
        this.bounds = { left, right, top, bottom };
    }

    getBounds() {
        return { ...this.bounds };
    }
}

