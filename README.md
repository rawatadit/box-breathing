# Box Breathing App

A beautiful, calming box breathing application with smooth animations to help you relax and focus.

## Features

- 4-phase breathing cycle (Inhale → Hold → Exhale → Hold)
- Smooth animations with expanding/contracting circles
- Visual countdown timer
- Pause/Resume functionality
- Keyboard shortcuts (Spacebar: Start/Pause, Escape: Reset)
- Responsive design for mobile and desktop
- Beautiful gradient UI with glassmorphism effects

## Hosting Options

### Option 1: Vercel (Recommended - Easiest)

1. Install Vercel CLI (requires Node.js):
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Or use the Vercel website:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import this repository
   - Click "Deploy"

### Option 2: Netlify

1. **Using Netlify CLI** (requires Node.js):
   ```bash
   npm install -g netlify-cli
   netlify deploy
   ```

2. **Using Netlify Drag & Drop** (No installation needed):
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag the entire project folder
   - Your app is live instantly!

3. **Using Netlify Website**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login
   - Click "Add new site" → "Deploy manually"
   - Drag your project folder

### Option 3: GitHub Pages

1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/box-breathing.git
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Select "main" branch
   - Click Save
   - Your app will be live at `https://YOUR_USERNAME.github.io/box-breathing/`

### Option 4: Local Python Server (No installation if Python is installed)

1. Navigate to the project directory:
   ```bash
   cd /path/to/box-breathing
   ```

2. Start a simple server:
   ```bash
   # Python 3
   python3 -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

3. Open browser to `http://localhost:8000`

### Option 5: Node.js/Express Server

If you have Node.js installed:

1. Create `package.json`:
   ```bash
   npm init -y
   ```

2. Install Express:
   ```bash
   npm install express
   ```

3. Create `server.js`:
   ```javascript
   const express = require('express');
   const path = require('path');
   const app = express();
   const PORT = process.env.PORT || 3000;

   app.use(express.static(__dirname));

   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'index.html'));
   });

   app.listen(PORT, () => {
     console.log(`Server running on http://localhost:${PORT}`);
   });
   ```

4. Add to `package.json` scripts:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```

5. Run:
   ```bash
   npm start
   ```

## Keyboard Shortcuts

- **Spacebar**: Start/Pause breathing exercise
- **Escape**: Reset to beginning

## How Box Breathing Works

Box breathing is a simple relaxation technique used by athletes, military personnel, and anyone seeking to reduce stress:

1. **Inhale** through your nose for 4 seconds
2. **Hold** your breath for 4 seconds
3. **Exhale** through your mouth for 4 seconds
4. **Hold** for 4 seconds

Repeat this cycle to promote relaxation and mental clarity.

## License

MIT License - Feel free to use and modify!
