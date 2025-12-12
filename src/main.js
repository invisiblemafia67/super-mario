/**
 * Super Mario Advanced - Main Entry Point
 * A highly advanced Super Mario Bros game with modern features
 */

import Game from './engine/Game.js';
import './styles/main.css';

// Game configuration
const CONFIG = {
    canvas: {
        width: 1024,
        height: 576,
        targetFPS: 60
    },
    debug: {
        enabled: false,
        showFPS: true,
        showColliders: false,
        showEntityCount: true
    },
    graphics: {
        pixelPerfect: true,
        smoothing: false,
        scale: 2
    },
    audio: {
        masterVolume: 0.8,
        musicVolume: 0.7,
        sfxVolume: 0.9
    },
    controls: {
        keyboard: {
            left: ['ArrowLeft', 'KeyA'],
            right: ['ArrowRight', 'KeyD'],
            jump: ['Space', 'ArrowUp', 'KeyW'],
            run: ['ShiftLeft', 'ShiftRight'],
            duck: ['ArrowDown', 'KeyS'],
            pause: ['Escape', 'KeyP'],
            debug: ['F1']
        },
        gamepad: {
            enabled: true,
            deadzone: 0.2
        }
    }
};

class GameApplication {
    constructor() {
        this.game = null;
        this.canvas = null;
        this.loadingScreen = null;
        this.debugInfo = null;
        this.isInitialized = false;
    }

    async initialize() {
        try {
            console.log('🎮 Initializing Super Mario Advanced...');
            
            // Get DOM elements
            this.canvas = document.getElementById('gameCanvas');
            this.loadingScreen = document.getElementById('loadingScreen');
            this.debugInfo = document.getElementById('debugInfo');
            
            if (!this.canvas) {
                throw new Error('Game canvas not found!');
            }

            // Set up canvas
            this.setupCanvas();
            
            // Initialize game engine
            this.game = new Game(this.canvas, CONFIG);
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load game assets and initialize
            await this.loadGame();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            // Start the game
            this.game.start();
            
            this.isInitialized = true;
            console.log('✅ Super Mario Advanced initialized successfully!');
            
        } catch (error) {
            console.error('❌ Failed to initialize game:', error);
            this.showError(error.message);
        }
    }

    setupCanvas() {
        const ctx = this.canvas.getContext('2d');
        
        // Disable image smoothing for pixel-perfect rendering
        ctx.imageSmoothingEnabled = CONFIG.graphics.smoothing;
        ctx.webkitImageSmoothingEnabled = CONFIG.graphics.smoothing;
        ctx.mozImageSmoothingEnabled = CONFIG.graphics.smoothing;
        ctx.msImageSmoothingEnabled = CONFIG.graphics.smoothing;
        
        // Set canvas size
        this.canvas.width = CONFIG.canvas.width;
        this.canvas.height = CONFIG.canvas.height;
        
        console.log(`🖼️ Canvas initialized: ${CONFIG.canvas.width}x${CONFIG.canvas.height}`);
    }

    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (event) => {
            if (this.game && this.isInitialized) {
                this.game.handleKeyDown(event);
            }
            
            // Debug toggle
            if (event.code === 'F1') {
                event.preventDefault();
                this.toggleDebug();
            }
        });

        document.addEventListener('keyup', (event) => {
            if (this.game && this.isInitialized) {
                this.game.handleKeyUp(event);
            }
        });

        // Window events
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        window.addEventListener('blur', () => {
            if (this.game && this.isInitialized) {
                this.game.pause();
            }
        });

        window.addEventListener('focus', () => {
            if (this.game && this.isInitialized) {
                this.game.resume();
            }
        });

        // Gamepad events
        window.addEventListener('gamepadconnected', (event) => {
            console.log('🎮 Gamepad connected:', event.gamepad.id);
            if (this.game) {
                this.game.handleGamepadConnected(event.gamepad);
            }
        });

        window.addEventListener('gamepaddisconnected', (event) => {
            console.log('🎮 Gamepad disconnected:', event.gamepad.id);
            if (this.game) {
                this.game.handleGamepadDisconnected(event.gamepad);
            }
        });
    }

    async loadGame() {
        const loadingSteps = [
            'Loading game engine...',
            'Loading sprites and animations...',
            'Loading audio files...',
            'Loading level data...',
            'Initializing physics engine...',
            'Setting up AI systems...',
            'Preparing graphics pipeline...',
            'Ready to play!'
        ];

        for (let i = 0; i < loadingSteps.length; i++) {
            this.updateLoadingText(loadingSteps[i]);
            
            // Simulate loading time for dramatic effect
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
            
            // Actual loading would happen here
            switch (i) {
                case 0:
                    await this.game.initializeEngine();
                    break;
                case 1:
                    await this.game.loadAssets();
                    break;
                case 2:
                    await this.game.initializeAudio();
                    break;
                case 3:
                    await this.game.loadLevels();
                    break;
                case 4:
                    await this.game.initializePhysics();
                    break;
                case 5:
                    await this.game.initializeAI();
                    break;
                case 6:
                    await this.game.initializeGraphics();
                    break;
                case 7:
                    await this.game.finalizeInitialization();
                    break;
            }
        }
    }

    updateLoadingText(text) {
        const loadingText = this.loadingScreen.querySelector('div:last-child');
        if (loadingText) {
            loadingText.textContent = text;
        }
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            this.loadingScreen.style.transition = 'opacity 0.5s ease-out';
            
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    showError(message) {
        if (this.loadingScreen) {
            this.loadingScreen.innerHTML = `
                <div style="color: #ff4444; font-size: 24px; text-align: center;">
                    ❌ Error Loading Game
                    <div style="font-size: 16px; margin-top: 20px; opacity: 0.8;">
                        ${message}
                    </div>
                    <div style="font-size: 14px; margin-top: 20px; opacity: 0.6;">
                        Please refresh the page to try again
                    </div>
                </div>
            `;
        }
    }

    toggleDebug() {
        CONFIG.debug.enabled = !CONFIG.debug.enabled;
        
        if (this.debugInfo) {
            this.debugInfo.style.display = CONFIG.debug.enabled ? 'block' : 'none';
        }
        
        if (this.game) {
            this.game.setDebugMode(CONFIG.debug.enabled);
        }
        
        console.log(`🔧 Debug mode: ${CONFIG.debug.enabled ? 'ON' : 'OFF'}`);
    }

    handleResize() {
        // Handle responsive canvas sizing if needed
        // For now, we'll keep the fixed size for pixel-perfect rendering
        console.log('🔄 Window resized');
    }

    // Public API for external access
    getGame() {
        return this.game;
    }

    getConfig() {
        return CONFIG;
    }
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const app = new GameApplication();
    
    // Make app globally accessible for debugging
    window.MarioGame = app;
    
    try {
        await app.initialize();
    } catch (error) {
        console.error('Failed to start game:', error);
    }
});

// Handle unhandled errors gracefully
window.addEventListener('error', (event) => {
    console.error('Unhandled error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

export default GameApplication;

