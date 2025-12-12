/**
 * Super Mario Advanced - Core Game Engine
 * Main game class that orchestrates all game systems
 */

import GameLoop from './GameLoop.js';
import Renderer from './Renderer.js';
import Scene from './Scene.js';
import EntityManager from './EntityManager.js';
import ComponentManager from './ComponentManager.js';
import SystemManager from './SystemManager.js';

export default class Game {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.config = config;
        
        // Core engine components
        this.gameLoop = null;
        this.renderer = null;
        this.currentScene = null;
        this.entityManager = null;
        this.componentManager = null;
        this.systemManager = null;
        
        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.isDebugMode = false;
        this.deltaTime = 0;
        this.totalTime = 0;
        
        // Input state
        this.input = {
            keys: new Set(),
            keysPressed: new Set(),
            keysReleased: new Set(),
            gamepad: null
        };
        
        // Performance tracking
        this.performance = {
            fps: 0,
            frameCount: 0,
            lastFpsUpdate: 0,
            entityCount: 0,
            drawCalls: 0
        };
        
        // Asset management
        this.assets = {
            images: new Map(),
            audio: new Map(),
            fonts: new Map(),
            data: new Map()
        };
        
        console.log('🎮 Game engine created');
    }

    async initializeEngine() {
        console.log('🔧 Initializing game engine...');
        
        // Initialize core managers
        this.entityManager = new EntityManager();
        this.componentManager = new ComponentManager();
        this.systemManager = new SystemManager(this);
        
        // Initialize renderer
        this.renderer = new Renderer(this.ctx, this.config.graphics);
        
        // Initialize game loop
        this.gameLoop = new GameLoop(this.config.canvas.targetFPS);
        this.gameLoop.onUpdate = (deltaTime) => this.update(deltaTime);
        this.gameLoop.onRender = () => this.render();
        
        console.log('✅ Game engine initialized');
    }

    async loadAssets() {
        console.log('📦 Loading game assets...');
        
        // For now, we'll create placeholder assets
        // In a real implementation, this would load actual sprite sheets, sounds, etc.
        
        // Create placeholder Mario sprite
        const marioSprite = this.createPlaceholderSprite(32, 32, '#FF0000');
        this.assets.images.set('mario_small', marioSprite);
        
        const marioSuperSprite = this.createPlaceholderSprite(32, 48, '#FF4444');
        this.assets.images.set('mario_super', marioSuperSprite);
        
        // Create placeholder enemy sprites
        const goombaSprite = this.createPlaceholderSprite(32, 32, '#8B4513');
        this.assets.images.set('goomba', goombaSprite);
        
        const koopaSprite = this.createPlaceholderSprite(32, 48, '#00AA00');
        this.assets.images.set('koopa', koopaSprite);
        
        // Create placeholder block sprites
        const brickSprite = this.createPlaceholderSprite(32, 32, '#D2691E');
        this.assets.images.set('brick', brickSprite);
        
        const questionSprite = this.createPlaceholderSprite(32, 32, '#FFD700');
        this.assets.images.set('question_block', questionSprite);
        
        const pipeSprite = this.createPlaceholderSprite(64, 128, '#00AA00');
        this.assets.images.set('pipe', pipeSprite);
        
        // Create placeholder coin sprite
        const coinSprite = this.createPlaceholderSprite(24, 24, '#FFD700');
        this.assets.images.set('coin', coinSprite);
        
        console.log('✅ Assets loaded');
    }

    createPlaceholderSprite(width, height, color) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Create a simple colored rectangle with border
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);
        
        // Add some simple details
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(4, 4, width - 8, height / 2 - 4);
        
        return canvas;
    }

    async initializeAudio() {
        console.log('🔊 Initializing audio system...');
        
        // Audio system will be implemented in a later step
        // For now, just placeholder
        
        console.log('✅ Audio system initialized');
    }

    async loadLevels() {
        console.log('🗺️ Loading level data...');
        
        // Level system will be implemented in a later step
        // For now, create a simple test level
        const testLevel = {
            name: 'World 1-1',
            width: 3200,
            height: 576,
            background: '#5C94FC',
            entities: []
        };
        
        this.assets.data.set('level_1_1', testLevel);
        
        console.log('✅ Level data loaded');
    }

    async initializePhysics() {
        console.log('⚡ Initializing physics engine...');
        
        // Physics system will be implemented in a later step
        
        console.log('✅ Physics engine initialized');
    }

    async initializeAI() {
        console.log('🤖 Initializing AI systems...');
        
        // AI system will be implemented in a later step
        
        console.log('✅ AI systems initialized');
    }

    async initializeGraphics() {
        console.log('🎨 Initializing graphics pipeline...');
        
        // Advanced graphics features will be implemented in a later step
        
        console.log('✅ Graphics pipeline initialized');
    }

    async finalizeInitialization() {
        console.log('🎯 Finalizing game initialization...');
        
        // Create initial scene
        this.currentScene = new Scene('main_game');
        
        // Add some test entities for demonstration
        this.createTestEntities();
        
        console.log('✅ Game initialization complete');
    }

    createTestEntities() {
        // This will create some basic entities for testing
        // Real entity creation will be handled by the level system
        
        console.log('🎭 Creating test entities...');
        
        // Create Mario entity (placeholder)
        const mario = this.entityManager.createEntity('mario');
        this.componentManager.addComponent(mario, 'transform', {
            x: 100,
            y: 400,
            width: 32,
            height: 32
        });
        this.componentManager.addComponent(mario, 'sprite', {
            image: 'mario_small',
            offsetX: 0,
            offsetY: 0
        });
        
        // Create some test blocks
        for (let i = 0; i < 10; i++) {
            const block = this.entityManager.createEntity('block');
            this.componentManager.addComponent(block, 'transform', {
                x: 200 + i * 32,
                y: 500,
                width: 32,
                height: 32
            });
            this.componentManager.addComponent(block, 'sprite', {
                image: 'brick',
                offsetX: 0,
                offsetY: 0
            });
        }
        
        console.log('✅ Test entities created');
    }

    start() {
        if (this.isRunning) {
            console.warn('⚠️ Game is already running');
            return;
        }
        
        console.log('🚀 Starting game...');
        this.isRunning = true;
        this.gameLoop.start();
    }

    stop() {
        if (!this.isRunning) {
            console.warn('⚠️ Game is not running');
            return;
        }
        
        console.log('⏹️ Stopping game...');
        this.isRunning = false;
        this.gameLoop.stop();
    }

    pause() {
        if (!this.isRunning || this.isPaused) {
            return;
        }
        
        console.log('⏸️ Pausing game...');
        this.isPaused = true;
        this.gameLoop.pause();
    }

    resume() {
        if (!this.isRunning || !this.isPaused) {
            return;
        }
        
        console.log('▶️ Resuming game...');
        this.isPaused = false;
        this.gameLoop.resume();
    }

    update(deltaTime) {
        if (this.isPaused) return;
        
        this.deltaTime = deltaTime;
        this.totalTime += deltaTime;
        
        // Update performance metrics
        this.updatePerformanceMetrics();
        
        // Clear input events from previous frame
        this.input.keysPressed.clear();
        this.input.keysReleased.clear();
        
        // Update all systems
        this.systemManager.update(deltaTime);
        
        // Update current scene
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
        
        // Update debug info
        if (this.isDebugMode) {
            this.updateDebugInfo();
        }
    }

    render() {
        if (this.isPaused) return;
        
        // Clear canvas
        this.renderer.clear();
        
        // Render current scene
        if (this.currentScene) {
            this.currentScene.render(this.renderer);
        }
        
        // Render all entities (temporary - will be handled by render system)
        this.renderEntities();
        
        // Render debug info
        if (this.isDebugMode) {
            this.renderDebugInfo();
        }
    }

    renderEntities() {
        // Temporary entity rendering - will be replaced by proper render system
        const entities = this.entityManager.getAllEntities();
        
        for (const entity of entities) {
            const transform = this.componentManager.getComponent(entity, 'transform');
            const sprite = this.componentManager.getComponent(entity, 'sprite');
            
            if (transform && sprite) {
                const image = this.assets.images.get(sprite.image);
                if (image) {
                    this.ctx.drawImage(
                        image,
                        transform.x,
                        transform.y,
                        transform.width,
                        transform.height
                    );
                }
            }
        }
    }

    updatePerformanceMetrics() {
        this.performance.frameCount++;
        this.performance.entityCount = this.entityManager.getEntityCount();
        
        const now = performance.now();
        if (now - this.performance.lastFpsUpdate >= 1000) {
            this.performance.fps = this.performance.frameCount;
            this.performance.frameCount = 0;
            this.performance.lastFpsUpdate = now;
        }
    }

    updateDebugInfo() {
        const fpsElement = document.getElementById('fps');
        const entityCountElement = document.getElementById('entityCount');
        const playerPosElement = document.getElementById('playerPos');
        
        if (fpsElement) fpsElement.textContent = this.performance.fps;
        if (entityCountElement) entityCountElement.textContent = this.performance.entityCount;
        if (playerPosElement) playerPosElement.textContent = '100, 400'; // Placeholder
    }

    renderDebugInfo() {
        // Render debug overlays on canvas
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 200, 80);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`FPS: ${this.performance.fps}`, 20, 30);
        this.ctx.fillText(`Entities: ${this.performance.entityCount}`, 20, 50);
        this.ctx.fillText(`Delta: ${this.deltaTime.toFixed(2)}ms`, 20, 70);
        
        this.ctx.restore();
    }

    // Input handling
    handleKeyDown(event) {
        this.input.keys.add(event.code);
        this.input.keysPressed.add(event.code);
        
        // Prevent default for game keys
        const gameKeys = [
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Space', 'KeyA', 'KeyD', 'KeyW', 'KeyS',
            'ShiftLeft', 'ShiftRight'
        ];
        
        if (gameKeys.includes(event.code)) {
            event.preventDefault();
        }
    }

    handleKeyUp(event) {
        this.input.keys.delete(event.code);
        this.input.keysReleased.add(event.code);
    }

    handleGamepadConnected(gamepad) {
        this.input.gamepad = gamepad;
        console.log('🎮 Gamepad connected:', gamepad.id);
    }

    handleGamepadDisconnected(gamepad) {
        if (this.input.gamepad && this.input.gamepad.index === gamepad.index) {
            this.input.gamepad = null;
        }
        console.log('🎮 Gamepad disconnected');
    }

    // Utility methods
    setDebugMode(enabled) {
        this.isDebugMode = enabled;
        console.log(`🔧 Debug mode: ${enabled ? 'ON' : 'OFF'}`);
    }

    getAsset(type, name) {
        return this.assets[type]?.get(name);
    }

    isKeyPressed(keyCode) {
        return this.input.keys.has(keyCode);
    }

    wasKeyPressed(keyCode) {
        return this.input.keysPressed.has(keyCode);
    }

    wasKeyReleased(keyCode) {
        return this.input.keysReleased.has(keyCode);
    }

    // Getters
    getDeltaTime() {
        return this.deltaTime;
    }

    getTotalTime() {
        return this.totalTime;
    }

    getEntityManager() {
        return this.entityManager;
    }

    getComponentManager() {
        return this.componentManager;
    }

    getSystemManager() {
        return this.systemManager;
    }

    getRenderer() {
        return this.renderer;
    }
}

