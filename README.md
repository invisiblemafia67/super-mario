# Marvel Heroes Arena 🦸‍♂️⚡

A team-based hero shooter game inspired by Marvel Rivals, built with HTML5 Canvas and JavaScript.

## 🎮 Game Overview

Marvel Heroes Arena is a web-based multiplayer-style game where players choose from iconic Marvel heroes and battle in team-based objective modes. Each hero has unique abilities and playstyles, creating diverse tactical gameplay.

## 🦸‍♂️ Heroes

### Iron Man 🤖
- **Role**: Damage Dealer
- **Health**: ★★★☆☆ (120 HP)
- **Damage**: ★★★★☆ (High ranged damage)
- **Speed**: ★★★☆☆ (Medium mobility)
- **Abilities**:
  - **Q - Repulsor Blast**: Fires multiple energy projectiles in a spread
  - **E - Missile Salvo**: Launches explosive missiles with area damage
  - **R - Unibeam**: Devastating laser beam that pierces through enemies

### Spider-Man 🕷️
- **Role**: Flanker/Assassin
- **Health**: ★★☆☆☆ (80 HP)
- **Damage**: ★★★☆☆ (Medium damage)
- **Speed**: ★★★★★ (Highest mobility)
- **Abilities**:
  - **Q - Web Shot**: Slows enemies and deals damage
  - **E - Web Swing**: Quick dash for repositioning
  - **R - Spider Sense**: Temporary speed boost and enhanced reflexes

### Captain America 🛡️
- **Role**: Tank/Support
- **Health**: ★★★★☆ (150 HP)
- **Damage**: ★★★☆☆ (Balanced damage)
- **Speed**: ★★★☆☆ (Medium mobility)
- **Abilities**:
  - **Q - Shield Throw**: Bouncing shield that hits multiple enemies
  - **E - Shield Block**: Damage reduction and defensive stance
  - **R - Rallying Cry**: Heals nearby teammates

### Thor ⚡
- **Role**: Heavy Damage/Tank
- **Health**: ★★★★★ (180 HP)
- **Damage**: ★★★★★ (Highest damage)
- **Speed**: ★★☆☆☆ (Lowest mobility)
- **Abilities**:
  - **Q - Lightning Bolt**: Chain lightning that jumps between enemies
  - **E - Mjolnir Throw**: Hammer throw with knockback that returns
  - **R - Thunderstorm**: Area of effect lightning strikes

## 🎯 Game Modes

### Control Points
- Capture and hold three strategic points (A, B, C)
- Teams earn points by controlling objectives
- First team to reach the score limit wins
- Match duration: 5 minutes

## 🎮 Controls

### Movement
- **WASD** or **Arrow Keys**: Move character
- **Mouse**: Aim and look direction

### Combat
- **Left Mouse Button**: Primary attack
- **Q**: Ability 1
- **E**: Ability 2  
- **R**: Ultimate ability

### Game
- **Tab**: Show scoreboard
- **Escape**: Pause menu
- **F1**: Help/Controls
- **F11**: Toggle fullscreen

## 🚀 Features

- **4 Unique Heroes**: Each with distinct abilities and playstyles
- **Team-Based Combat**: 3v3 battles with AI teammates and enemies
- **Visual Effects**: Particle effects, explosions, and ability animations
- **Real-time HUD**: Health bars, ability cooldowns, minimap, and score tracking
- **Responsive Design**: Works on desktop and mobile devices
- **Progressive Gameplay**: Respawn system and objective-based scoring

## 🛠️ Technical Features

- **HTML5 Canvas Rendering**: Smooth 60fps gameplay
- **Modular Architecture**: Easy to extend with new heroes and abilities
- **Physics System**: Collision detection and projectile physics
- **AI System**: Intelligent computer-controlled teammates and enemies
- **Effect System**: Visual effects and animations
- **Audio System**: Sound effects and feedback (placeholder)

## 🎨 Game Systems

### Character System
- Base Character class with inheritance for heroes
- Ability system with cooldowns and effects
- Health, damage, and movement mechanics

### Combat System
- Projectile-based combat with collision detection
- Area of effect abilities and damage
- Knockback and status effects

### Team System
- Blue vs Red team mechanics
- Friendly fire prevention
- Team-based objectives and scoring

### AI System
- Intelligent enemy targeting
- Movement and ability usage
- Difficulty scaling

## 🚀 Getting Started

1. Open `index.html` in a modern web browser
2. Click "Play Game" from the main menu
3. Select your hero from the character selection screen
4. Use WASD to move and mouse to aim
5. Capture control points and defeat enemies to win!

## 🔧 Development

The game is built with vanilla JavaScript and HTML5 Canvas for maximum compatibility and performance. The modular architecture makes it easy to add new heroes, abilities, and game modes.

### File Structure
```
├── index.html              # Main game page
├── styles/                 # CSS styling
│   ├── main.css           # Main UI styles
│   ├── game.css           # Game screen styles
│   └── ui.css             # Additional UI components
├── scripts/               # JavaScript game logic
│   ├── main.js            # Entry point and initialization
│   ├── game.js            # Core game loop and management
│   ├── utils.js           # Utility functions
│   ├── input.js           # Input handling
│   ├── renderer.js        # Rendering system
│   ├── physics.js         # Physics and collision
│   ├── character.js       # Character and game objects
│   ├── effects.js         # Visual effects system
│   ├── audio.js           # Audio management
│   ├── ui.js              # UI management
│   ├── hud.js             # HUD and interface
│   └── heroes/            # Hero implementations
│       ├── ironman.js
│       ├── spiderman.js
│       ├── captain-america.js
│       └── thor.js
└── assets/                # Game assets (placeholder)
    ├── sounds/
    └── images/
```

## 🎯 Future Enhancements

- **More Heroes**: Additional Marvel characters with unique abilities
- **New Game Modes**: Payload, Team Deathmatch, King of the Hill
- **Multiplayer**: Real-time online multiplayer support
- **Customization**: Hero skins, ability upgrades, and loadouts
- **Maps**: Multiple battlefields with unique layouts
- **Ranked Play**: Competitive matchmaking and progression
- **Mobile Support**: Touch controls and mobile optimization

## 🎮 Tips for Players

1. **Learn Hero Roles**: Each hero excels in different situations
2. **Use Abilities Wisely**: Manage cooldowns and positioning
3. **Control Objectives**: Focus on capturing and defending points
4. **Team Coordination**: Work with AI teammates to control areas
5. **Positioning**: Use cover and high ground advantages
6. **Resource Management**: Pick up health packs and power-ups

## 🏆 Credits

Inspired by Marvel Rivals and built as a web-based tribute to team-based hero shooters. All Marvel character references are used for educational and entertainment purposes.

---

**Enjoy the battle, heroes! 🦸‍♂️⚡🕷️🛡️**
