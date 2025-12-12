// Marvel Heroes Arena - UI Manager

class UIManager {
    constructor() {
        this.currentScreen = 'menu';
    }
    
    init() {
        console.log('UI Manager initialized');
    }
    
    showMainMenu() {
        this.hideAllScreens();
        document.getElementById('mainMenu').classList.add('active');
        this.currentScreen = 'menu';
    }
    
    showGameScreen() {
        this.hideAllScreens();
        document.getElementById('gameScreen').classList.add('active');
        this.currentScreen = 'game';
    }
    
    showPauseMenu() {
        document.getElementById('pauseMenu').classList.add('active');
    }
    
    hidePauseMenu() {
        document.getElementById('pauseMenu').classList.remove('active');
    }
    
    showGameOver(winner, teams, player) {
        window.showGameOver(winner, teams, player);
    }
    
    hideAllScreens() {
        document.querySelectorAll('.menu-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById('gameScreen').classList.remove('active');
    }
}

window.UIManager = UIManager;
