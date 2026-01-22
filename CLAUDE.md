# Box Breathing App

## Preferences
- In all interactions and commit messages, be extremely concise and sacrifice grammar for the sake of concision.

## Project Overview
A web-based box breathing application for guided breathing exercises. Pure HTML/CSS/JS with no build tools or frameworks.

## Tech Stack
- HTML5
- CSS3 (animations, flexbox, grid)
- Vanilla JavaScript
- Web Audio API for sound cues

## Key Files
- `index.html` - Main app with session selection and breathing interface
- `style.css` - All styling including animations and responsive design
- `script.js` - App logic, audio, and breathing phase management
- `learn.html` - Educational page about box breathing

## Features
- Multiple session types: Quick Calm (2min), Deep Relaxation (5min), Focus (3min), Custom
- Visual box animation with glowing tracer that traces edges during breathing phases
- Audio cues with distinct tones for each phase (inhale/hold/exhale/hold)
- Pause/resume functionality
- Keyboard shortcuts (Space to start/pause, Escape to go back)
- localStorage for audio preference persistence

## Breathing Phases
Each phase is 4 seconds:
1. Inhale (top edge) - 600Hz tone
2. Hold (right edge) - 800Hz tone
3. Exhale (bottom edge) - 500Hz tone
4. Hold (left edge) - 700Hz tone

## Testing
Open `index.html` directly in browser - no server required.
