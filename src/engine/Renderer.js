/**
 * Super Mario Advanced - Renderer
 * Advanced 2D rendering system with batching and effects
 */

export default class Renderer {
    constructor(ctx, config = {}) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.config = {
            pixelPerfect: config.pixelPerfect || true,
            smoothing: config.smoothing || false,
            scale: config.scale || 1,
            ...config
        };
        
        // Rendering state
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1,
            rotation: 0,
            shake: { x: 0, y: 0, intensity: 0, duration: 0 }
        };
        
        // Batch rendering
        this.spriteBatch = [];
        this.maxBatchSize = 1000;
        
        // Effects
        this.effects = {
            screenShake: false,
            colorFilter: null,
            brightness: 1.0,
            contrast: 1.0,
            saturation: 1.0
        };
        
        // Performance tracking
        this.stats = {
            drawCalls: 0,
            spritesRendered: 0,
            batchesProcessed: 0
        };
        
        this.setupCanvas();
        console.log('🎨 Renderer initialized');
    }

    setupCanvas() {
        // Configure canvas for pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = this.config.smoothing;
        this.ctx.webkitImageSmoothingEnabled = this.config.smoothing;
        this.ctx.mozImageSmoothingEnabled = this.config.smoothing;
        this.ctx.msImageSmoothingEnabled = this.config.smoothing;
        
        if (!this.config.smoothing) {
            this.ctx.imageSmoothingQuality = 'high';
        }
    }

    clear(color = '#5C94FC') {
        this.ctx.save();
        
        // Reset transform
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        // Clear with background color
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.restore();
        
        // Reset stats
        this.stats.drawCalls = 0;
        this.stats.spritesRendered = 0;
        this.stats.batchesProcessed = 0;
    }

    beginFrame() {
        this.ctx.save();
        
        // Apply camera transform
        this.applyCameraTransform();
        
        // Apply screen effects
        this.applyScreenEffects();
    }

    endFrame() {
        // Flush any remaining batched sprites
        this.flushSpriteBatch();
        
        this.ctx.restore();
    }

    applyCameraTransform() {
        const { x, y, zoom, rotation, shake } = this.camera;
        
        // Apply camera shake
        const shakeX = shake.intensity > 0 ? (Math.random() - 0.5) * shake.x : 0;
        const shakeY = shake.intensity > 0 ? (Math.random() - 0.5) * shake.y : 0;
        
        // Transform canvas
        this.ctx.translate(
            this.canvas.width / 2 + shakeX,
            this.canvas.height / 2 + shakeY
        );
        this.ctx.scale(zoom, zoom);
        this.ctx.rotate(rotation);
        this.ctx.translate(-x, -y);
    }

    applyScreenEffects() {
        if (this.effects.colorFilter) {
            this.ctx.filter = this.effects.colorFilter;
        }
        
        // Additional effects can be applied here
        if (this.effects.brightness !== 1.0 || 
            this.effects.contrast !== 1.0 || 
            this.effects.saturation !== 1.0) {
            
            const filters = [];
            if (this.effects.brightness !== 1.0) {
                filters.push(`brightness(${this.effects.brightness})`);
            }
            if (this.effects.contrast !== 1.0) {
                filters.push(`contrast(${this.effects.contrast})`);
            }
            if (this.effects.saturation !== 1.0) {
                filters.push(`saturate(${this.effects.saturation})`);
            }
            
            this.ctx.filter = filters.join(' ');
        }
    }

    // Sprite rendering
    drawSprite(image, x, y, width = null, height = null, options = {}) {
        if (!image) return;
        
        const drawWidth = width || image.width;
        const drawHeight = height || image.height;
        
        // Add to batch if batching is enabled
        if (options.batch !== false && this.spriteBatch.length < this.maxBatchSize) {
            this.spriteBatch.push({
                image,
                x, y,
                width: drawWidth,
                height: drawHeight,
                options
            });
            return;
        }
        
        // Draw immediately
        this.drawSpriteImmediate(image, x, y, drawWidth, drawHeight, options);
    }

    drawSpriteImmediate(image, x, y, width, height, options = {}) {
        this.ctx.save();
        
        // Apply sprite-specific transforms
        if (options.rotation) {
            this.ctx.translate(x + width / 2, y + height / 2);
            this.ctx.rotate(options.rotation);
            this.ctx.translate(-width / 2, -height / 2);
            x = 0;
            y = 0;
        }
        
        if (options.flipX || options.flipY) {
            this.ctx.translate(x + width / 2, y + height / 2);
            this.ctx.scale(options.flipX ? -1 : 1, options.flipY ? -1 : 1);
            this.ctx.translate(-width / 2, -height / 2);
            x = 0;
            y = 0;
        }
        
        // Apply opacity
        if (options.alpha !== undefined) {
            this.ctx.globalAlpha = options.alpha;
        }
        
        // Apply blend mode
        if (options.blendMode) {
            this.ctx.globalCompositeOperation = options.blendMode;
        }
        
        // Draw the sprite
        if (options.sourceRect) {
            const { sx, sy, sw, sh } = options.sourceRect;
            this.ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
        } else {
            this.ctx.drawImage(image, x, y, width, height);
        }
        
        this.ctx.restore();
        
        this.stats.drawCalls++;
        this.stats.spritesRendered++;
    }

    flushSpriteBatch() {
        if (this.spriteBatch.length === 0) return;
        
        // Sort batch by texture for better performance
        this.spriteBatch.sort((a, b) => {
            if (a.image === b.image) return 0;
            return a.image < b.image ? -1 : 1;
        });
        
        // Draw all batched sprites
        for (const sprite of this.spriteBatch) {
            this.drawSpriteImmediate(
                sprite.image,
                sprite.x,
                sprite.y,
                sprite.width,
                sprite.height,
                sprite.options
            );
        }
        
        this.stats.batchesProcessed++;
        this.spriteBatch.length = 0;
    }

    // Shape rendering
    drawRect(x, y, width, height, color, options = {}) {
        this.ctx.save();
        
        if (options.alpha !== undefined) {
            this.ctx.globalAlpha = options.alpha;
        }
        
        this.ctx.fillStyle = color;
        
        if (options.outline) {
            this.ctx.strokeStyle = options.outline.color || '#000000';
            this.ctx.lineWidth = options.outline.width || 1;
            this.ctx.strokeRect(x, y, width, height);
        } else {
            this.ctx.fillRect(x, y, width, height);
        }
        
        this.ctx.restore();
        this.stats.drawCalls++;
    }

    drawCircle(x, y, radius, color, options = {}) {
        this.ctx.save();
        
        if (options.alpha !== undefined) {
            this.ctx.globalAlpha = options.alpha;
        }
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        
        if (options.outline) {
            this.ctx.strokeStyle = options.outline.color || '#000000';
            this.ctx.lineWidth = options.outline.width || 1;
            this.ctx.stroke();
        } else {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }
        
        this.ctx.restore();
        this.stats.drawCalls++;
    }

    drawLine(x1, y1, x2, y2, color, width = 1, options = {}) {
        this.ctx.save();
        
        if (options.alpha !== undefined) {
            this.ctx.globalAlpha = options.alpha;
        }
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        
        if (options.lineCap) {
            this.ctx.lineCap = options.lineCap;
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        
        this.ctx.restore();
        this.stats.drawCalls++;
    }

    // Text rendering
    drawText(text, x, y, options = {}) {
        this.ctx.save();
        
        const fontSize = options.fontSize || 16;
        const fontFamily = options.fontFamily || 'Arial';
        const color = options.color || '#000000';
        const align = options.align || 'left';
        const baseline = options.baseline || 'top';
        
        this.ctx.font = `${fontSize}px ${fontFamily}`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseline;
        
        if (options.alpha !== undefined) {
            this.ctx.globalAlpha = options.alpha;
        }
        
        if (options.outline) {
            this.ctx.strokeStyle = options.outline.color || '#000000';
            this.ctx.lineWidth = options.outline.width || 1;
            this.ctx.strokeText(text, x, y);
        }
        
        this.ctx.fillText(text, x, y);
        
        this.ctx.restore();
        this.stats.drawCalls++;
    }

    // Camera controls
    setCamera(x, y, zoom = 1, rotation = 0) {
        this.camera.x = x;
        this.camera.y = y;
        this.camera.zoom = zoom;
        this.camera.rotation = rotation;
    }

    moveCamera(dx, dy) {
        this.camera.x += dx;
        this.camera.y += dy;
    }

    screenShake(intensity, duration, x = 10, y = 10) {
        this.camera.shake = {
            intensity,
            duration,
            x,
            y
        };
        
        // Auto-reduce shake over time
        const reduceShake = () => {
            this.camera.shake.duration -= 16; // Assume 60fps
            this.camera.shake.intensity *= 0.95;
            
            if (this.camera.shake.duration > 0 && this.camera.shake.intensity > 0.01) {
                setTimeout(reduceShake, 16);
            } else {
                this.camera.shake.intensity = 0;
                this.camera.shake.duration = 0;
            }
        };
        
        reduceShake();
    }

    // Effects
    setColorFilter(filter) {
        this.effects.colorFilter = filter;
    }

    setBrightness(value) {
        this.effects.brightness = Math.max(0, value);
    }

    setContrast(value) {
        this.effects.contrast = Math.max(0, value);
    }

    setSaturation(value) {
        this.effects.saturation = Math.max(0, value);
    }

    // Utility methods
    worldToScreen(worldX, worldY) {
        const screenX = (worldX - this.camera.x) * this.camera.zoom + this.canvas.width / 2;
        const screenY = (worldY - this.camera.y) * this.camera.zoom + this.canvas.height / 2;
        return { x: screenX, y: screenY };
    }

    screenToWorld(screenX, screenY) {
        const worldX = (screenX - this.canvas.width / 2) / this.camera.zoom + this.camera.x;
        const worldY = (screenY - this.canvas.height / 2) / this.camera.zoom + this.camera.y;
        return { x: worldX, y: worldY };
    }

    isVisible(x, y, width, height) {
        const margin = 100; // Extra margin for off-screen objects
        const left = this.camera.x - this.canvas.width / (2 * this.camera.zoom) - margin;
        const right = this.camera.x + this.canvas.width / (2 * this.camera.zoom) + margin;
        const top = this.camera.y - this.canvas.height / (2 * this.camera.zoom) - margin;
        const bottom = this.camera.y + this.canvas.height / (2 * this.camera.zoom) + margin;
        
        return !(x + width < left || x > right || y + height < top || y > bottom);
    }

    // Getters
    getCamera() {
        return { ...this.camera };
    }

    getStats() {
        return { ...this.stats };
    }

    getCanvas() {
        return this.canvas;
    }

    getContext() {
        return this.ctx;
    }
}

