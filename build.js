#!/usr/bin/env node

/**
 * Super Mario Advanced - Build Script
 * Creates a production build and packages for distribution
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building Super Mario Advanced...');

try {
    // Clean previous build
    if (fs.existsSync('dist')) {
        console.log('🧹 Cleaning previous build...');
        fs.rmSync('dist', { recursive: true, force: true });
    }

    // Run webpack build
    console.log('📦 Running webpack build...');
    execSync('npx webpack --mode production', { stdio: 'inherit' });

    // Copy additional files
    console.log('📋 Copying additional files...');
    
    // Copy README and instructions
    fs.copyFileSync('README.md', 'dist/README.md');
    fs.copyFileSync('DOWNLOAD_INSTRUCTIONS.md', 'dist/DOWNLOAD_INSTRUCTIONS.md');
    
    // Create package.json for distribution
    const packageJson = {
        name: "super-mario-advanced",
        version: "1.0.0",
        description: "A highly advanced Super Mario Bros game",
        main: "index.html",
        scripts: {
            "start": "python -m http.server 8000 || php -S localhost:8000 || npx serve .",
            "serve": "npx serve ."
        },
        keywords: ["game", "mario", "platformer", "html5"],
        author: "Codegen",
        license: "MIT"
    };
    
    fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));

    // Create a simple server script
    const serverScript = `#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, () => {
    console.log(\`🎮 Super Mario Advanced server running at http://localhost:\${port}/\`);
    console.log('Press Ctrl+C to stop the server');
});
`;

    fs.writeFileSync('dist/server.js', serverScript);
    
    // Make server script executable
    try {
        fs.chmodSync('dist/server.js', '755');
    } catch (e) {
        // Ignore chmod errors on Windows
    }

    // Create start scripts for different platforms
    const startBat = `@echo off
echo Starting Super Mario Advanced...
node server.js
pause`;

    const startSh = `#!/bin/bash
echo "Starting Super Mario Advanced..."
node server.js`;

    fs.writeFileSync('dist/start.bat', startBat);
    fs.writeFileSync('dist/start.sh', startSh);
    
    try {
        fs.chmodSync('dist/start.sh', '755');
    } catch (e) {
        // Ignore chmod errors on Windows
    }

    // Create instructions file
    const instructions = `# 🎮 Super Mario Advanced - Ready to Play!

## 🚀 Quick Start

### Option 1: Double-click to start
- **Windows**: Double-click \`start.bat\`
- **Mac/Linux**: Double-click \`start.sh\` or run \`./start.sh\` in terminal

### Option 2: Manual start
1. Open terminal/command prompt in this folder
2. Run: \`node server.js\`
3. Open browser to: http://localhost:8000

### Option 3: Direct file access
- Simply open \`index.html\` in any modern web browser
- No server needed for basic functionality

## 🎯 What's Included

- Complete game with all advanced features
- Built-in web server for optimal performance
- Cross-platform compatibility
- All source code and assets
- Documentation and instructions

## 🎮 Controls

- **Arrow Keys / WASD**: Move Mario
- **Space**: Jump
- **Shift**: Run
- **F1**: Debug mode
- **Esc**: Pause

Enjoy your advanced Super Mario adventure! 🍄✨
`;

    fs.writeFileSync('dist/PLAY_INSTRUCTIONS.txt', instructions);

    console.log('✅ Build completed successfully!');
    console.log('📁 Files are ready in the dist/ folder');
    console.log('🎮 To play: cd dist && node server.js');
    console.log('🌐 Or open dist/index.html in your browser');

} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
`;

module.exports = {};

