/**
 * Super Mario Advanced - Game Loop
 * High-precision game loop with fixed timestep and interpolation
 */

export default class GameLoop {
    constructor(targetFPS = 60) {
        this.targetFPS = targetFPS;
        this.targetFrameTime = 1000 / targetFPS; // milliseconds per frame
        this.maxFrameTime = this.targetFrameTime * 3; // Prevent spiral of death
        
        // Timing
        this.lastTime = 0;
        this.accumulator = 0;
        this.currentTime = 0;
        this.frameId = null;
        
        // State
        this.isRunning = false;
        this.isPaused = false;
        
        // Callbacks
        this.onUpdate = null;
        this.onRender = null;
        this.onFPSUpdate = null;
        
        // Performance tracking
        this.frameCount = 0;
        this.fpsTimer = 0;
        this.currentFPS = 0;
        
        console.log(`🔄 GameLoop created with target FPS: ${targetFPS}`);
    }

    start() {
        if (this.isRunning) {
            console.warn('⚠️ GameLoop is already running');
            return;
        }
        
        console.log('🚀 Starting game loop...');
        this.isRunning = true;
        this.isPaused = false;
        this.lastTime = performance.now();
        this.accumulator = 0;
        
        this.loop();
    }

    stop() {
        if (!this.isRunning) {
            console.warn('⚠️ GameLoop is not running');
            return;
        }
        
        console.log('⏹️ Stopping game loop...');
        this.isRunning = false;
        
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
    }

    pause() {
        if (!this.isRunning || this.isPaused) {
            return;
        }
        
        console.log('⏸️ Pausing game loop...');
        this.isPaused = true;
    }

    resume() {
        if (!this.isRunning || !this.isPaused) {
            return;
        }
        
        console.log('▶️ Resuming game loop...');
        this.isPaused = false;
        this.lastTime = performance.now(); // Reset timing to prevent large delta
    }

    loop() {
        if (!this.isRunning) {
            return;
        }
        
        this.currentTime = performance.now();
        let deltaTime = this.currentTime - this.lastTime;
        this.lastTime = this.currentTime;
        
        // Prevent spiral of death - cap maximum frame time
        if (deltaTime > this.maxFrameTime) {
            deltaTime = this.maxFrameTime;
        }
        
        if (!this.isPaused) {
            // Fixed timestep with accumulator
            this.accumulator += deltaTime;
            
            // Update at fixed intervals
            while (this.accumulator >= this.targetFrameTime) {
                if (this.onUpdate) {
                    this.onUpdate(this.targetFrameTime);
                }
                this.accumulator -= this.targetFrameTime;
            }
            
            // Render with interpolation factor
            if (this.onRender) {
                const interpolation = this.accumulator / this.targetFrameTime;
                this.onRender(interpolation);
            }
        }
        
        // Update FPS counter
        this.updateFPS(deltaTime);
        
        // Schedule next frame
        this.frameId = requestAnimationFrame(() => this.loop());
    }

    updateFPS(deltaTime) {
        this.frameCount++;
        this.fpsTimer += deltaTime;
        
        // Update FPS every second
        if (this.fpsTimer >= 1000) {
            this.currentFPS = Math.round((this.frameCount * 1000) / this.fpsTimer);
            
            if (this.onFPSUpdate) {
                this.onFPSUpdate(this.currentFPS);
            }
            
            this.frameCount = 0;
            this.fpsTimer = 0;
        }
    }

    // Getters
    getFPS() {
        return this.currentFPS;
    }

    getTargetFPS() {
        return this.targetFPS;
    }

    isActive() {
        return this.isRunning && !this.isPaused;
    }

    // Setters
    setTargetFPS(fps) {
        this.targetFPS = fps;
        this.targetFrameTime = 1000 / fps;
        this.maxFrameTime = this.targetFrameTime * 3;
        console.log(`🔄 Target FPS changed to: ${fps}`);
    }
}

