# 📥 Download & Play Super Mario Advanced

## 🚀 Quick Download & Setup

### Option 1: Download as ZIP (Easiest)
1. **Click the green "Code" button** at the top of this repository
2. **Select "Download ZIP"**
3. **Extract the ZIP file** to your desired location
4. **Open terminal/command prompt** in the extracted folder
5. **Run these commands:**
   ```bash
   npm install
   npm start
   ```
6. **Open your browser** to `http://localhost:3000` and enjoy! 🎮

### Option 2: Clone with Git
```bash
git clone https://github.com/invisiblemafia67/super-mario.git
cd super-mario
npm install
npm start
```

### Option 3: Build for Offline Play
```bash
npm install
npm run build
```
Then open `dist/index.html` in any web browser - no server needed!

## 🎮 System Requirements

### Minimum Requirements
- **Node.js** 14+ (for development)
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **2GB RAM**
- **Graphics card** with WebGL support

### Recommended
- **Node.js** 18+
- **Chrome/Firefox** latest version
- **4GB+ RAM**
- **Dedicated graphics card**
- **Gamepad/Controller** for best experience

## 🎯 What You Get

### ✨ Advanced Features
- **Professional game engine** with ECS architecture
- **Smooth 60fps gameplay** with advanced physics
- **Intelligent enemy AI** with behavior trees
- **Dynamic music system** that adapts to gameplay
- **Particle effects & lighting** for stunning visuals
- **Save system** with multiple save slots
- **Achievement system** with progress tracking
- **Level editor** for creating custom levels
- **Speedrun mode** with timing
- **Full gamepad support**

### 🎨 Visual Excellence
- **Pixel-perfect rendering** with retro aesthetics
- **Advanced graphics pipeline** with batching
- **Screen shake & camera effects**
- **Parallax scrolling backgrounds**
- **Post-processing effects**

### 🔊 Audio Excellence
- **3D positional audio** for immersive sound
- **Dynamic music** that responds to gameplay
- **High-quality sound effects**
- **Real-time audio processing**

## 🛠️ Development Mode

### For Developers
```bash
npm run dev     # Development build with watch mode
npm run lint    # Check code quality
npm run format  # Format code
npm test        # Run tests
```

### Debug Features
- Press **F1** to toggle debug mode
- View FPS, entity count, and performance metrics
- Visualize collision boxes and physics
- Monitor system performance

## 🌐 Deployment Options

### Local Web Server
After building (`npm run build`), serve the `dist/` folder with any web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve dist

# Using PHP
php -S localhost:8000 -t dist
```

### Online Hosting
Deploy the `dist/` folder to:
- **GitHub Pages** (free)
- **Netlify** (free)
- **Vercel** (free)
- **AWS S3** (paid)
- Any web hosting service

### Desktop App (Advanced)
Convert to desktop app using Electron:
```bash
npm install electron --save-dev
# Add Electron configuration
npm run electron-pack
```

## 🎮 Controls

| Action | Keyboard | Gamepad | Description |
|--------|----------|---------|-------------|
| Move | ← → / A D | Left Stick | Move Mario left/right |
| Jump | Space / ↑ / W | A Button | Jump (variable height) |
| Run | Shift | X Button | Hold to run faster |
| Duck | ↓ / S | Down | Duck/crouch |
| Pause | Esc / P | Start | Pause game |
| Debug | F1 | - | Toggle debug mode |

## 🏆 Game Features

### Classic Mario Mechanics
- **Variable jump height** based on button press duration
- **Momentum-based movement** for realistic physics
- **Power-up system** (Small, Super, Fire Mario)
- **Classic enemies** with modern AI
- **Familiar level design** with modern twists

### Advanced Features
- **Procedural level generation** for infinite gameplay
- **Custom level editor** for creating your own levels
- **Replay system** for recording and sharing gameplay
- **Achievement system** with unlockable content
- **Statistics tracking** for performance analysis
- **Cloud save** for progress synchronization

## 🆘 Troubleshooting

### Common Issues

**Game won't start:**
- Make sure Node.js is installed (`node --version`)
- Run `npm install` to install dependencies
- Check browser console for errors

**Performance issues:**
- Close other browser tabs
- Update your graphics drivers
- Try a different browser
- Lower graphics settings (if available)

**Audio not working:**
- Check browser audio permissions
- Ensure audio is not muted
- Try refreshing the page

**Gamepad not detected:**
- Connect gamepad before starting game
- Try pressing buttons to activate
- Check browser gamepad support

### Getting Help
- Check the **README.md** for detailed documentation
- Look at **browser console** for error messages
- Create an **issue** on GitHub for bugs
- Join our **community** for support

## 🎉 Enjoy the Game!

You now have a fully-featured, advanced Super Mario Bros game with modern web technologies! The game includes professional-grade features like:

- **Entity-Component-System architecture**
- **Advanced physics simulation**
- **Intelligent AI systems**
- **Dynamic audio and graphics**
- **Performance optimization**
- **Accessibility features**

Have fun playing and feel free to modify the code to create your own Mario adventure! 🍄✨

---

**Built with ❤️ using modern web technologies**

