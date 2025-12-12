// Marvel Heroes Arena - Input Management System

class Input {
    constructor() {
        this.keys = {};
        this.keysPressed = {};
        this.keysReleased = {};
        this.mouse = {
            x: 0,
            y: 0,
            worldX: 0,
            worldY: 0,
            left: false,
            right: false,
            middle: false,
            leftPressed: false,
            rightPressed: false,
            middlePressed: false,
            leftReleased: false,
            rightReleased: false,
            middleReleased: false
        };
        
        this.canvas = null;
        this.keyCallbacks = {};
        this.mouseCallbacks = {};
        
        // Movement keys
        this.movement = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        // Ability keys
        this.abilities = {
            ability1: false,
            ability2: false,
            ultimate: false
        };
        
        // Other game keys
        this.gameKeys = {
            reload: false,
            interact: false,
            scoreboard: false,
            chat: false,
            pause: false
        };
        
        this.setupKeyMappings();
    }
    
    init(canvas) {
        this.canvas = canvas;
        this.setupEventListeners();
        console.log('Input system initialized');
    }
    
    setupKeyMappings() {
        // Default key mappings
        this.keyMappings = {
            // Movement
            'KeyW': 'up',
            'KeyS': 'down',
            'KeyA': 'left',
            'KeyD': 'right',
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            
            // Abilities
            'KeyQ': 'ability1',
            'KeyE': 'ability2',
            'KeyR': 'ultimate',
            
            // Game controls
            'KeyF': 'interact',
            'KeyG': 'reload',
            'Tab': 'scoreboard',
            'Enter': 'chat',
            'Escape': 'pause',
            
            // Additional controls
            'Space': 'jump',
            'ShiftLeft': 'sprint',
            'ControlLeft': 'crouch'
        };
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Prevent default behavior for game keys
        document.addEventListener('keydown', (e) => {
            if (this.keyMappings[e.code] || e.code === 'Tab' || e.code === 'Space') {
                e.preventDefault();
            }
        });
        
        // Focus management
        this.canvas.addEventListener('click', () => {
            this.canvas.focus();
        });
        
        // Make canvas focusable
        this.canvas.tabIndex = 0;
    }
    
    handleKeyDown(e) {
        const key = e.code;
        
        // Track raw key state
        if (!this.keys[key]) {
            this.keysPressed[key] = true;
        }
        this.keys[key] = true;
        
        // Update mapped controls
        this.updateMappedControls();
        
        // Call registered callbacks
        if (this.keyCallbacks[key]) {
            this.keyCallbacks[key].forEach(callback => callback(e));
        }
        
        // Special handling for certain keys
        this.handleSpecialKeys(key, e);
    }
    
    handleKeyUp(e) {
        const key = e.code;
        
        // Track raw key state
        this.keys[key] = false;
        this.keysReleased[key] = true;
        
        // Update mapped controls
        this.updateMappedControls();
    }
    
    handleMouseDown(e) {
        this.updateMousePosition(e);
        
        switch (e.button) {
            case 0: // Left click
                this.mouse.left = true;
                this.mouse.leftPressed = true;
                break;
            case 1: // Middle click
                this.mouse.middle = true;
                this.mouse.middlePressed = true;
                e.preventDefault();
                break;
            case 2: // Right click
                this.mouse.right = true;
                this.mouse.rightPressed = true;
                break;
        }
        
        // Call mouse callbacks
        if (this.mouseCallbacks.down) {
            this.mouseCallbacks.down.forEach(callback => callback(e));
        }
    }
    
    handleMouseUp(e) {
        this.updateMousePosition(e);
        
        switch (e.button) {
            case 0: // Left click
                this.mouse.left = false;
                this.mouse.leftReleased = true;
                break;
            case 1: // Middle click
                this.mouse.middle = false;
                this.mouse.middleReleased = true;
                break;
            case 2: // Right click
                this.mouse.right = false;
                this.mouse.rightReleased = true;
                break;
        }
        
        // Call mouse callbacks
        if (this.mouseCallbacks.up) {
            this.mouseCallbacks.up.forEach(callback => callback(e));
        }
    }
    
    handleMouseMove(e) {
        this.updateMousePosition(e);
        
        // Call mouse callbacks
        if (this.mouseCallbacks.move) {
            this.mouseCallbacks.move.forEach(callback => callback(e));
        }
    }
    
    updateMousePosition(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        this.mouse.x = (e.clientX - rect.left) * scaleX;
        this.mouse.y = (e.clientY - rect.top) * scaleY;
        
        // Calculate world position (requires camera from game)
        if (window.game && window.game.camera) {
            this.mouse.worldX = this.mouse.x + window.game.camera.x;
            this.mouse.worldY = this.mouse.y + window.game.camera.y;
        }
    }
    
    updateMappedControls() {
        // Update movement
        this.movement.up = this.isKeyDown('KeyW') || this.isKeyDown('ArrowUp');
        this.movement.down = this.isKeyDown('KeyS') || this.isKeyDown('ArrowDown');
        this.movement.left = this.isKeyDown('KeyA') || this.isKeyDown('ArrowLeft');
        this.movement.right = this.isKeyDown('KeyD') || this.isKeyDown('ArrowRight');
        
        // Update abilities
        this.abilities.ability1 = this.isKeyDown('KeyQ');
        this.abilities.ability2 = this.isKeyDown('KeyE');
        this.abilities.ultimate = this.isKeyDown('KeyR');
        
        // Update game keys
        this.gameKeys.reload = this.isKeyDown('KeyG');
        this.gameKeys.interact = this.isKeyDown('KeyF');
        this.gameKeys.scoreboard = this.isKeyDown('Tab');
        this.gameKeys.chat = this.isKeyDown('Enter');
        this.gameKeys.pause = this.isKeyDown('Escape');
    }
    
    handleSpecialKeys(key, e) {
        // Handle keys that need special processing
        switch (key) {
            case 'Tab':
                e.preventDefault();
                break;
            case 'Enter':
                // Handle chat input
                break;
            case 'Escape':
                // Handle pause menu
                break;
        }
    }
    
    update() {
        // Clear pressed/released states
        this.keysPressed = {};
        this.keysReleased = {};
        this.mouse.leftPressed = false;
        this.mouse.rightPressed = false;
        this.mouse.middlePressed = false;
        this.mouse.leftReleased = false;
        this.mouse.rightReleased = false;
        this.mouse.middleReleased = false;
    }
    
    // Utility methods
    isKeyDown(key) {
        return !!this.keys[key];
    }
    
    isKeyPressed(key) {
        return !!this.keysPressed[key];
    }
    
    isKeyReleased(key) {
        return !!this.keysReleased[key];
    }
    
    isMouseDown(button = 'left') {
        switch (button) {
            case 'left': return this.mouse.left;
            case 'right': return this.mouse.right;
            case 'middle': return this.mouse.middle;
            default: return false;
        }
    }
    
    isMousePressed(button = 'left') {
        switch (button) {
            case 'left': return this.mouse.leftPressed;
            case 'right': return this.mouse.rightPressed;
            case 'middle': return this.mouse.middlePressed;
            default: return false;
        }
    }
    
    isMouseReleased(button = 'left') {
        switch (button) {
            case 'left': return this.mouse.leftReleased;
            case 'right': return this.mouse.rightReleased;
            case 'middle': return this.mouse.middleReleased;
            default: return false;
        }
    }
    
    getMovementVector() {
        let x = 0;
        let y = 0;
        
        if (this.movement.left) x -= 1;
        if (this.movement.right) x += 1;
        if (this.movement.up) y -= 1;
        if (this.movement.down) y += 1;
        
        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            const length = Math.sqrt(x * x + y * y);
            x /= length;
            y /= length;
        }
        
        return { x, y };
    }
    
    getMouseAngle(fromX, fromY) {
        return Math.atan2(this.mouse.worldY - fromY, this.mouse.worldX - fromX);
    }
    
    getMouseDistance(fromX, fromY) {
        return Utils.distance(fromX, fromY, this.mouse.worldX, this.mouse.worldY);
    }
    
    // Event registration
    onKeyPress(key, callback) {
        if (!this.keyCallbacks[key]) {
            this.keyCallbacks[key] = [];
        }
        this.keyCallbacks[key].push(callback);
    }
    
    onMouseDown(callback) {
        if (!this.mouseCallbacks.down) {
            this.mouseCallbacks.down = [];
        }
        this.mouseCallbacks.down.push(callback);
    }
    
    onMouseUp(callback) {
        if (!this.mouseCallbacks.up) {
            this.mouseCallbacks.up = [];
        }
        this.mouseCallbacks.up.push(callback);
    }
    
    onMouseMove(callback) {
        if (!this.mouseCallbacks.move) {
            this.mouseCallbacks.move = [];
        }
        this.mouseCallbacks.move.push(callback);
    }
    
    // Key mapping management
    setKeyMapping(key, action) {
        this.keyMappings[key] = action;
        this.updateMappedControls();
    }
    
    getKeyMapping(action) {
        for (const [key, mappedAction] of Object.entries(this.keyMappings)) {
            if (mappedAction === action) {
                return key;
            }
        }
        return null;
    }
    
    // Save/load key mappings
    saveKeyMappings() {
        Utils.saveToStorage('keyMappings', this.keyMappings);
    }
    
    loadKeyMappings() {
        const saved = Utils.loadFromStorage('keyMappings');
        if (saved) {
            this.keyMappings = { ...this.keyMappings, ...saved };
            this.updateMappedControls();
        }
    }
    
    resetKeyMappings() {
        this.setupKeyMappings();
        this.updateMappedControls();
    }
    
    // Input validation
    isValidKey(key) {
        return typeof key === 'string' && key.length > 0;
    }
    
    isGameplayKey(key) {
        return Object.values(this.keyMappings).includes(key);
    }
    
    // Debug methods
    getInputState() {
        return {
            keys: { ...this.keys },
            mouse: { ...this.mouse },
            movement: { ...this.movement },
            abilities: { ...this.abilities },
            gameKeys: { ...this.gameKeys }
        };
    }
    
    logInputState() {
        console.log('Input State:', this.getInputState());
    }
}

// Export for global access
window.Input = Input;
