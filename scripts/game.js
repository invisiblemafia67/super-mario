// Marvel Heroes Arena - Main Game Class

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.minimapCanvas = document.getElementById('minimapCanvas');
        this.minimapCtx = this.minimapCanvas.getContext('2d');
        
        // Game state
        this.state = 'menu'; // menu, playing, paused, gameOver
        this.lastTime = 0;
        this.deltaTime = 0;
        this.gameTime = 0;
        this.matchDuration = 300; // 5 minutes in seconds
        
        // World settings
        this.worldWidth = 2400;
        this.worldHeight = 1600;
        
        // Camera
        this.camera = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            smoothing: 0.1
        };
        
        // Game objects
        this.players = [];
        this.projectiles = [];
        this.effects = [];
        this.objectives = [];
        this.powerups = [];
        
        // Player reference
        this.player = null;
        this.selectedHero = 'ironman';
        
        // Teams
        this.teams = {
            blue: { score: 0, players: [] },
            red: { score: 0, players: [] }
        };
        
        // Game systems
        this.renderer = new Renderer(this.ctx, this.minimapCtx);
        this.physics = new Physics();
        this.input = new Input();
        this.audio = new AudioManager();
        this.effects = new EffectsManager();
        this.ui = new UIManager();
        this.hud = new HUDManager();
        
        // Game mode
        this.gameMode = null;
        
        // Performance tracking
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        
        this.init();
    }
    
    init() {
        console.log('Initializing Marvel Heroes Arena...');
        
        // Setup canvas
        this.setupCanvas();
        
        // Initialize systems
        this.input.init(this.canvas);
        this.audio.init();
        this.ui.init();
        this.hud.init();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Create world boundaries
        this.createWorldBoundaries();
        
        console.log('Game initialized successfully!');
    }
    
    setupCanvas() {
        // Set canvas size to match container
        const container = document.getElementById('gameContainer');
        const rect = container.getBoundingClientRect();
        
        this.canvas.width = Math.min(1200, rect.width);
        this.canvas.height = Math.min(800, rect.height);
        
        // Enable image smoothing
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        // Setup minimap
        this.minimapCanvas.width = 150;
        this.minimapCanvas.height = 150;
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
        });
        
        // Visibility change (pause when tab is hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.state === 'playing') {
                this.pause();
            }
        });
        
        // Input events
        this.input.onKeyPress('Escape', () => {
            if (this.state === 'playing') {
                this.pause();
            } else if (this.state === 'paused') {
                this.resume();
            }
        });
        
        this.input.onKeyPress('Tab', (e) => {
            e.preventDefault();
            this.hud.toggleScoreboard();
        });
    }
    
    createWorldBoundaries() {
        // Create invisible walls around the world
        this.boundaries = [
            { x: -50, y: -50, width: this.worldWidth + 100, height: 50 }, // Top
            { x: -50, y: this.worldHeight, width: this.worldWidth + 100, height: 50 }, // Bottom
            { x: -50, y: -50, width: 50, height: this.worldHeight + 100 }, // Left
            { x: this.worldWidth, y: -50, width: 50, height: this.worldHeight + 100 } // Right
        ];
    }
    
    startGame(heroType) {
        console.log(`Starting game with hero: ${heroType}`);
        
        this.selectedHero = heroType;
        this.state = 'playing';
        this.gameTime = 0;
        
        // Reset game objects
        this.players = [];
        this.projectiles = [];
        this.effects = [];
        this.powerups = [];
        
        // Reset teams
        this.teams.blue.score = 0;
        this.teams.red.score = 0;
        this.teams.blue.players = [];
        this.teams.red.players = [];
        
        // Create player
        this.createPlayer(heroType);
        
        // Create AI players
        this.createAIPlayers();
        
        // Initialize game mode
        this.gameMode = new ControlPointMode(this);
        this.gameMode.init();
        
        // Create objectives
        this.createObjectives();
        
        // Create power-ups
        this.createPowerups();
        
        // Update UI
        this.ui.showGameScreen();
        this.hud.updateHeroIcon(heroType);
        
        // Start game loop
        this.lastTime = performance.now();
        this.gameLoop();
        
        console.log('Game started successfully!');
    }
    
    createPlayer(heroType) {
        // Create player character
        const HeroClass = this.getHeroClass(heroType);
        this.player = new HeroClass(
            this.worldWidth / 2 - 200,
            this.worldHeight / 2,
            'blue',
            true // isPlayer
        );
        
        this.players.push(this.player);
        this.teams.blue.players.push(this.player);
        
        // Set camera target to player
        this.camera.targetX = this.player.x - this.canvas.width / 2;
        this.camera.targetY = this.player.y - this.canvas.height / 2;
    }
    
    createAIPlayers() {
        const heroTypes = ['ironman', 'spiderman', 'captain-america', 'thor'];
        
        // Create blue team AI (2 players)
        for (let i = 0; i < 2; i++) {
            const heroType = Utils.randomChoice(heroTypes);
            const HeroClass = this.getHeroClass(heroType);
            const ai = new HeroClass(
                this.worldWidth / 2 - 300 + i * 100,
                this.worldHeight / 2 + Utils.random(-100, 100),
                'blue',
                false
            );
            ai.ai = new AIController(ai, this);
            this.players.push(ai);
            this.teams.blue.players.push(ai);
        }
        
        // Create red team AI (3 players)
        for (let i = 0; i < 3; i++) {
            const heroType = Utils.randomChoice(heroTypes);
            const HeroClass = this.getHeroClass(heroType);
            const ai = new HeroClass(
                this.worldWidth / 2 + 200 + i * 100,
                this.worldHeight / 2 + Utils.random(-100, 100),
                'red',
                false
            );
            ai.ai = new AIController(ai, this);
            this.players.push(ai);
            this.teams.red.players.push(ai);
        }
    }
    
    getHeroClass(heroType) {
        switch (heroType) {
            case 'ironman': return IronMan;
            case 'spiderman': return SpiderMan;
            case 'captain-america': return CaptainAmerica;
            case 'thor': return Thor;
            default: return IronMan;
        }
    }
    
    createObjectives() {
        // Create control points for the game mode
        this.objectives = [
            new ControlPoint(this.worldWidth * 0.25, this.worldHeight * 0.5, 'A'),
            new ControlPoint(this.worldWidth * 0.5, this.worldHeight * 0.3, 'B'),
            new ControlPoint(this.worldWidth * 0.75, this.worldHeight * 0.5, 'C')
        ];
    }
    
    createPowerups() {
        // Create health packs and ability boosters
        const powerupPositions = [
            { x: this.worldWidth * 0.2, y: this.worldHeight * 0.2 },
            { x: this.worldWidth * 0.8, y: this.worldHeight * 0.2 },
            { x: this.worldWidth * 0.2, y: this.worldHeight * 0.8 },
            { x: this.worldWidth * 0.8, y: this.worldHeight * 0.8 },
            { x: this.worldWidth * 0.5, y: this.worldHeight * 0.7 }
        ];
        
        powerupPositions.forEach(pos => {
            const type = Utils.randomChoice(['health', 'ability', 'damage']);
            this.powerups.push(new Powerup(pos.x, pos.y, type));
        });
    }
    
    gameLoop(currentTime = 0) {
        if (this.state !== 'playing') return;
        
        // Calculate delta time
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Cap delta time to prevent large jumps
        this.deltaTime = Math.min(this.deltaTime, 1/30);
        
        // Update game time
        this.gameTime += this.deltaTime;
        
        // Update FPS counter
        this.updateFPS();
        
        // Update game systems
        this.update();
        this.render();
        
        // Continue game loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update() {
        // Update input
        this.input.update();
        
        // Update camera
        this.updateCamera();
        
        // Update players
        this.players.forEach(player => {
            player.update(this.deltaTime, this);
            
            // Check boundaries
            this.checkBoundaries(player);
        });
        
        // Update projectiles
        this.projectiles = this.projectiles.filter(projectile => {
            projectile.update(this.deltaTime, this);
            return !projectile.destroyed;
        });
        
        // Update effects
        this.effects.update(this.deltaTime);
        
        // Update objectives
        this.objectives.forEach(objective => {
            objective.update(this.deltaTime, this.players);
        });
        
        // Update powerups
        this.powerups.forEach(powerup => {
            powerup.update(this.deltaTime, this.players);
        });
        
        // Update game mode
        if (this.gameMode) {
            this.gameMode.update(this.deltaTime);
        }
        
        // Update HUD
        this.hud.update(this.player, this.gameTime, this.matchDuration, this.teams);
        
        // Check win conditions
        this.checkWinConditions();
    }
    
    updateCamera() {
        if (this.player) {
            // Follow player with smooth camera
            this.camera.targetX = this.player.x - this.canvas.width / 2;
            this.camera.targetY = this.player.y - this.canvas.height / 2;
            
            // Clamp camera to world bounds
            this.camera.targetX = Utils.clamp(this.camera.targetX, 0, this.worldWidth - this.canvas.width);
            this.camera.targetY = Utils.clamp(this.camera.targetY, 0, this.worldHeight - this.canvas.height);
            
            // Smooth camera movement
            this.camera.x = Utils.lerp(this.camera.x, this.camera.targetX, this.camera.smoothing);
            this.camera.y = Utils.lerp(this.camera.y, this.camera.targetY, this.camera.smoothing);
        }
    }
    
    checkBoundaries(entity) {
        // Keep entities within world bounds
        entity.x = Utils.clamp(entity.x, entity.radius, this.worldWidth - entity.radius);
        entity.y = Utils.clamp(entity.y, entity.radius, this.worldHeight - entity.radius);
    }
    
    updateFPS() {
        this.frameCount++;
        if (performance.now() - this.lastFpsUpdate >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = performance.now();
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context
        this.ctx.save();
        
        // Apply camera transform
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Render world background
        this.renderBackground();
        
        // Render objectives
        this.objectives.forEach(objective => {
            this.renderer.renderObjective(objective);
        });
        
        // Render powerups
        this.powerups.forEach(powerup => {
            this.renderer.renderPowerup(powerup);
        });
        
        // Render players
        this.players.forEach(player => {
            this.renderer.renderCharacter(player);
        });
        
        // Render projectiles
        this.projectiles.forEach(projectile => {
            this.renderer.renderProjectile(projectile);
        });
        
        // Render effects
        this.effects.render(this.ctx);
        
        // Restore context
        this.ctx.restore();
        
        // Render UI elements (not affected by camera)
        this.renderUI();
        
        // Render minimap
        this.renderMinimap();
    }
    
    renderBackground() {
        // Create a grid pattern for the background
        const gridSize = 100;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= this.worldWidth; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.worldHeight);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.worldHeight; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.worldWidth, y);
            this.ctx.stroke();
        }
    }
    
    renderUI() {
        // Render crosshair
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 10, centerY);
        this.ctx.lineTo(centerX + 10, centerY);
        this.ctx.moveTo(centerX, centerY - 10);
        this.ctx.lineTo(centerX, centerY + 10);
        this.ctx.stroke();
        
        // Render FPS (debug)
        if (window.DEBUG) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '16px Arial';
            this.ctx.fillText(`FPS: ${this.fps}`, 10, 30);
        }
    }
    
    renderMinimap() {
        const ctx = this.minimapCtx;
        const scale = 150 / Math.max(this.worldWidth, this.worldHeight);
        
        // Clear minimap
        ctx.clearRect(0, 0, 150, 150);
        
        // Draw world bounds
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this.worldWidth * scale, this.worldHeight * scale);
        
        // Draw objectives
        this.objectives.forEach(objective => {
            const x = objective.x * scale;
            const y = objective.y * scale;
            
            ctx.fillStyle = objective.controlledBy === 'blue' ? '#4ecdc4' : 
                           objective.controlledBy === 'red' ? '#ff6b6b' : '#ffd700';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw players
        this.players.forEach(player => {
            const x = player.x * scale;
            const y = player.y * scale;
            
            ctx.fillStyle = player.team === 'blue' ? '#4ecdc4' : '#ff6b6b';
            ctx.beginPath();
            ctx.arc(x, y, player.isPlayer ? 3 : 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Highlight player
            if (player.isPlayer) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });
        
        // Draw camera view
        const camX = this.camera.x * scale;
        const camY = this.camera.y * scale;
        const camW = this.canvas.width * scale;
        const camH = this.canvas.height * scale;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(camX, camY, camW, camH);
    }
    
    checkWinConditions() {
        // Check if time is up
        if (this.gameTime >= this.matchDuration) {
            this.endGame();
            return;
        }
        
        // Check if a team has reached the score limit
        if (this.teams.blue.score >= 3 || this.teams.red.score >= 3) {
            this.endGame();
            return;
        }
    }
    
    endGame() {
        this.state = 'gameOver';
        
        // Determine winner
        const winner = this.teams.blue.score > this.teams.red.score ? 'blue' : 
                      this.teams.red.score > this.teams.blue.score ? 'red' : 'tie';
        
        // Show game over screen
        this.ui.showGameOver(winner, this.teams, this.player);
        
        console.log('Game ended. Winner:', winner);
    }
    
    pause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            this.ui.showPauseMenu();
        }
    }
    
    resume() {
        if (this.state === 'paused') {
            this.state = 'playing';
            this.ui.hidePauseMenu();
            this.lastTime = performance.now();
            this.gameLoop();
        }
    }
    
    restart() {
        this.startGame(this.selectedHero);
    }
    
    returnToMenu() {
        this.state = 'menu';
        this.ui.showMainMenu();
    }
    
    // Utility methods for other systems
    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }
    
    addEffect(effect) {
        this.effects.add(effect);
    }
    
    getPlayersInRange(x, y, range, excludeTeam = null) {
        return this.players.filter(player => {
            if (excludeTeam && player.team === excludeTeam) return false;
            return Utils.distance(x, y, player.x, player.y) <= range;
        });
    }
    
    getEnemiesInRange(x, y, range, team) {
        return this.players.filter(player => {
            if (player.team === team) return false;
            return Utils.distance(x, y, player.x, player.y) <= range;
        });
    }
}

// Export for global access
window.Game = Game;
