# 🎮 Super Mario Advanced

A highly advanced Super Mario Bros game built with modern web technologies featuring sophisticated game engine architecture, advanced physics, AI systems, and stunning visual effects.

## 🚀 Features

### Core Game Engine
- **Entity-Component-System (ECS) Architecture** for maximum flexibility and performance
- **High-precision Game Loop** with fixed timestep and interpolation
- **Advanced 2D Renderer** with sprite batching and visual effects
- **Modular System Design** for easy maintenance and expansion

### Advanced Gameplay Features
- **Sophisticated Physics Engine** with realistic collision detection
- **Intelligent Enemy AI** with behavior trees and pathfinding
- **Dynamic Music System** that adapts to gameplay
- **Particle Effects & Lighting** for stunning visuals
- **Procedural Level Generation** + custom level editor
- **Cloud Save System** with achievements
- **Performance Optimization** for smooth 60fps gameplay

### Modern Web Technologies
- HTML5 Canvas with pixel-perfect rendering
- Modern JavaScript (ES6+) with modular architecture
- Webpack build system for optimization
- Cross-platform compatibility (Desktop, Mobile, Web)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Quick Start
1. **Download the game files**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start development server:**
   ```bash
   npm start
   ```
4. **Open your browser** to `http://localhost:3000`

### Build for Production
```bash
npm run build
```
This creates an optimized build in the `dist/` folder that you can deploy anywhere.

## 🎮 Controls

| Action | Keyboard | Description |
|--------|----------|-------------|
| Move Left | ← / A | Move Mario left |
| Move Right | → / D | Move Mario right |
| Jump | Space / ↑ / W | Jump (variable height) |
| Run | Shift | Hold to run faster |
| Duck | ↓ / S | Duck/crouch |
| Pause | Esc / P | Pause the game |
| Debug | F1 | Toggle debug mode |

### Gamepad Support
- Full gamepad/controller support
- Auto-detection of connected controllers
- Customizable button mapping

## 📁 Project Structure

```
super-mario-advanced/
├── src/
│   ├── engine/          # Core game engine
│   ├── physics/         # Physics simulation
│   ├── entities/        # Game entities (Mario, enemies, etc.)
│   ├── components/      # ECS components
│   ├── systems/         # ECS systems
│   ├── ai/             # AI and behavior systems
│   ├── level/          # Level management
│   ├── graphics/       # Graphics and effects
│   ├── audio/          # Audio system
│   ├── state/          # Game state management
│   └── ui/             # User interface
├── assets/
│   ├── images/         # Sprites and textures
│   ├── audio/          # Sound effects and music
│   └── fonts/          # Game fonts
├── levels/             # Level data files
└── dist/               # Built game files
```

## 🔧 Development

### Available Scripts
- `npm start` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run dev` - Build for development with watch mode
- `npm test` - Run tests
- `npm run lint` - Check code quality
- `npm run format` - Format code

### Debug Mode
Press **F1** to toggle debug mode which shows:
- FPS counter
- Entity count
- Player position
- Collision boxes
- Performance metrics

## 🎯 Game Architecture

### Entity-Component-System (ECS)
The game uses a modern ECS architecture where:
- **Entities** are unique identifiers
- **Components** store data (position, sprite, physics, etc.)
- **Systems** contain logic and operate on entities with specific components

### Physics Engine
- Accurate AABB collision detection
- Realistic physics simulation with gravity and friction
- Support for moving platforms and complex geometry
- Spatial partitioning for performance

### AI System
- State machines for enemy behavior
- Pathfinding algorithms
- Dynamic difficulty adjustment
- Behavior trees for complex AI patterns

## 🎨 Graphics Features

- **Pixel-perfect rendering** with crisp, retro aesthetics
- **Particle effects** for explosions, power-ups, and environmental effects
- **Dynamic lighting** with shadows and ambient lighting
- **Parallax scrolling** backgrounds for depth
- **Screen shake** and camera effects
- **Post-processing effects** like bloom and color grading

## 🔊 Audio Features

- **Dynamic music system** that adapts to gameplay
- **3D positional audio** for immersive sound effects
- **Real-time audio effects** and filters
- **Adaptive music** that responds to player actions
- **High-quality audio** with compression and streaming

## 🏆 Advanced Features

- **Save system** with multiple save slots
- **Achievement system** with progress tracking
- **Statistics collection** and analytics
- **Replay system** for recording and playback
- **Speedrun mode** with timing and leaderboards
- **Level editor** for creating custom levels
- **Accessibility options** for inclusive gaming

## 🌐 Deployment

### Local Deployment
1. Run `npm run build`
2. Serve the `dist/` folder with any web server
3. Open `index.html` in a browser

### Web Deployment
The built files can be deployed to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any web server

### Desktop App (Optional)
Use Electron to package as a desktop application:
```bash
npm install electron --save-dev
# Add Electron configuration
npm run electron-pack
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this code for your own projects!

## 🎮 Credits

Built with ❤️ using modern web technologies:
- HTML5 Canvas for rendering
- Web Audio API for sound
- Modern JavaScript (ES6+)
- Webpack for building
- And lots of coffee ☕

---

**Enjoy playing Super Mario Advanced!** 🍄✨

