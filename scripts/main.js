// Marvel Heroes Arena - Main Entry Point

// Global game instance
let game = null;

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Marvel Heroes Arena - Starting initialization...');
    
    // Show loading screen
    showLoadingScreen();
    
    // Initialize game with a delay to show loading
    setTimeout(() => {
        try {
            initializeGame();
        } catch (error) {
            console.error('Failed to initialize game:', error);
            showError('Failed to initialize game. Please refresh the page.');
        }
    }, 1000);
});

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    const loadingText = document.getElementById('loadingText');
    
    loadingScreen.style.display = 'flex';
    
    // Simulate loading progress
    let progress = 0;
    const loadingSteps = [
        'Initializing game systems...',
        'Loading hero data...',
        'Setting up battlefield...',
        'Preparing abilities...',
        'Ready to play!'
    ];
    
    const progressInterval = setInterval(() => {
        progress += 20;
        loadingProgress.style.width = progress + '%';
        
        const stepIndex = Math.floor(progress / 20) - 1;
        if (stepIndex >= 0 && stepIndex < loadingSteps.length) {
            loadingText.textContent = loadingSteps[stepIndex];
        }
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 200);
}

function initializeGame() {
    console.log('Creating game instance...');
    
    // Create global game instance
    game = new Game();
    window.game = game; // Make it globally accessible
    
    // Setup menu event listeners
    setupMenuEventListeners();
    
    console.log('Game initialization complete!');
}

function setupMenuEventListeners() {
    // Main menu buttons
    const playBtn = document.getElementById('playBtn');
    const heroSelectBtn = document.getElementById('heroSelectBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const helpBtn = document.getElementById('helpBtn');
    
    // Hero selection
    const heroCards = document.querySelectorAll('.hero-card');
    const confirmHeroBtn = document.getElementById('confirmHeroBtn');
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    
    // Pause menu
    const resumeBtn = document.getElementById('resumeBtn');
    const restartBtn = document.getElementById('restartBtn');
    const mainMenuBtn = document.getElementById('mainMenuBtn');
    
    // Game over screen
    const playAgainBtn = document.getElementById('playAgainBtn');
    const changeHeroBtn = document.getElementById('changeHeroBtn');
    const exitBtn = document.getElementById('exitBtn');
    
    // Main menu event listeners
    playBtn?.addEventListener('click', () => {
        showHeroSelect();
    });
    
    heroSelectBtn?.addEventListener('click', () => {
        showHeroSelect();
    });
    
    settingsBtn?.addEventListener('click', () => {
        showNotification('Settings coming soon!', 'warning');
    });
    
    helpBtn?.addEventListener('click', () => {
        showHelpDialog();
    });
    
    // Hero selection event listeners
    heroCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove previous selection
            heroCards.forEach(c => c.classList.remove('selected'));
            
            // Select this hero
            card.classList.add('selected');
            
            // Enable confirm button
            confirmHeroBtn.disabled = false;
            
            // Store selected hero
            const heroType = card.dataset.hero;
            confirmHeroBtn.dataset.selectedHero = heroType;
        });
    });
    
    confirmHeroBtn?.addEventListener('click', () => {
        const selectedHero = confirmHeroBtn.dataset.selectedHero;
        if (selectedHero && game) {
            startGame(selectedHero);
        }
    });
    
    backToMenuBtn?.addEventListener('click', () => {
        showMainMenu();
    });
    
    // Pause menu event listeners
    resumeBtn?.addEventListener('click', () => {
        if (game) {
            game.resume();
        }
    });
    
    restartBtn?.addEventListener('click', () => {
        if (game) {
            game.restart();
        }
    });
    
    mainMenuBtn?.addEventListener('click', () => {
        if (game) {
            game.returnToMenu();
        }
    });
    
    // Game over event listeners
    playAgainBtn?.addEventListener('click', () => {
        if (game) {
            game.restart();
        }
    });
    
    changeHeroBtn?.addEventListener('click', () => {
        showHeroSelect();
    });
    
    exitBtn?.addEventListener('click', () => {
        showMainMenu();
    });
}

function startGame(heroType) {
    console.log(`Starting game with hero: ${heroType}`);
    
    if (!game) {
        showError('Game not initialized!');
        return;
    }
    
    try {
        // Hide all menus
        hideAllMenus();
        
        // Show game screen
        showGameScreen();
        
        // Start the game
        game.startGame(heroType);
        
        showNotification(`Game started! Playing as ${getHeroName(heroType)}`, 'success');
    } catch (error) {
        console.error('Failed to start game:', error);
        showError('Failed to start game. Please try again.');
    }
}

function getHeroName(heroType) {
    const heroNames = {
        'ironman': 'Iron Man',
        'spiderman': 'Spider-Man',
        'captain-america': 'Captain America',
        'thor': 'Thor'
    };
    return heroNames[heroType] || heroType;
}

// UI Management Functions
function showMainMenu() {
    hideAllMenus();
    document.getElementById('mainMenu').classList.add('active');
}

function showHeroSelect() {
    hideAllMenus();
    document.getElementById('heroSelect').classList.add('active');
    
    // Reset hero selection
    document.querySelectorAll('.hero-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.getElementById('confirmHeroBtn').disabled = true;
}

function showGameScreen() {
    hideAllMenus();
    document.getElementById('gameScreen').classList.add('active');
}

function showPauseMenu() {
    document.getElementById('pauseMenu').classList.add('active');
}

function hidePauseMenu() {
    document.getElementById('pauseMenu').classList.remove('active');
}

function showGameOver(winner, teams, player) {
    const gameOverScreen = document.getElementById('gameOverScreen');
    const gameOverTitle = document.getElementById('gameOverTitle');
    const finalScore = document.getElementById('finalScore');
    const playerStats = document.getElementById('playerStats');
    
    // Determine title
    if (winner === 'tie') {
        gameOverTitle.textContent = 'Draw!';
    } else if ((winner === 'blue' && player.team === 'blue') || 
               (winner === 'red' && player.team === 'red')) {
        gameOverTitle.textContent = 'Victory!';
    } else {
        gameOverTitle.textContent = 'Defeat!';
    }
    
    // Update scores
    finalScore.textContent = `Blue ${teams.blue.score} - ${teams.red.score} Red`;
    
    // Update player stats (placeholder)
    playerStats.textContent = `${player.eliminations || 0} Eliminations, ${player.deaths || 0} Deaths`;
    
    gameOverScreen.classList.add('active');
}

function hideAllMenus() {
    document.querySelectorAll('.menu-screen').forEach(menu => {
        menu.classList.remove('active');
    });
    document.getElementById('gameScreen').classList.remove('active');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showError(message) {
    showNotification(message, 'error');
}

// Help Dialog
function showHelpDialog() {
    const helpContent = `
        <div class="controls-help">
            <h3>How to Play</h3>
            <div class="controls-grid">
                <div class="control-section">
                    <h4>Movement</h4>
                    <div class="control-item">
                        <span class="control-key">WASD</span>
                        <span class="control-description">Move character</span>
                    </div>
                    <div class="control-item">
                        <span class="control-key">Mouse</span>
                        <span class="control-description">Aim</span>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Combat</h4>
                    <div class="control-item">
                        <span class="control-key">LMB</span>
                        <span class="control-description">Primary attack</span>
                    </div>
                    <div class="control-item">
                        <span class="control-key">Q</span>
                        <span class="control-description">Ability 1</span>
                    </div>
                    <div class="control-item">
                        <span class="control-key">E</span>
                        <span class="control-description">Ability 2</span>
                    </div>
                    <div class="control-item">
                        <span class="control-key">R</span>
                        <span class="control-description">Ultimate</span>
                    </div>
                </div>
                <div class="control-section">
                    <h4>Game</h4>
                    <div class="control-item">
                        <span class="control-key">Tab</span>
                        <span class="control-description">Scoreboard</span>
                    </div>
                    <div class="control-item">
                        <span class="control-key">Esc</span>
                        <span class="control-description">Pause</span>
                    </div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="menu-btn primary" onclick="this.closest('.controls-help').remove()">Got it!</button>
            </div>
        </div>
    `;
    
    const overlay = document.createElement('div');
    overlay.className = 'menu-screen active';
    overlay.innerHTML = helpContent;
    overlay.style.zIndex = '2000';
    
    document.body.appendChild(overlay);
    
    // Remove on click outside
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Global shortcuts
    if (e.code === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
    
    if (e.code === 'F1') {
        e.preventDefault();
        showHelpDialog();
    }
});

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showError('An error occurred. Check the console for details.');
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showError('An error occurred. Check the console for details.');
});

// Export functions for global access
window.showMainMenu = showMainMenu;
window.showHeroSelect = showHeroSelect;
window.showGameScreen = showGameScreen;
window.showPauseMenu = showPauseMenu;
window.hidePauseMenu = hidePauseMenu;
window.showGameOver = showGameOver;
window.showNotification = showNotification;
window.showError = showError;

console.log('Main script loaded successfully!');
