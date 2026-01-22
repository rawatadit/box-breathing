# Box Breathing App - Feature Enhancement Plan

## Overview
Two main features to implement:
1. **Visual Fix**: Replace circle+box hybrid with a clean box animation
2. **Audio Cues**: Add subtle "ting" sounds for breathing phase transitions

---

## Progress Tracker

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | [x] Done | Remove circular elements |
| 2 | [x] Done | Box border tracing animation |
| 3 | [x] Done | Breathing visual feedback |
| 4 | [x] Done | Audio infrastructure |
| 5 | [x] Done | Audio + breathing integration |
| 6 | [x] Done | Simplify to single box, blue palette |
| 7 | [x] Done | Fix tracer continuity (no gaps between phases) |
| 8 | [x] Done | Remove box scaling, keep glow-only animation |

---

## Phase 1: Remove Circular Elements & Clean Up Box Display
**Status**: Pending

**Goal**: Remove the circular SVG progress ring, display only the box

**Changes**:
- `index.html`: Remove `<svg class="progress-ring">` element (lines 69-72)
- `style.css`: Remove `.progress-ring`, `.progress-ring-bg`, `.progress-ring-fill` styles
- `script.js`: Remove `progressCircle` reference and `updateProgressRing()` function
- `style.css`: Strengthen box border visibility

**Verification**: Open `index.html` - see ONLY the square box shape, no circular ring

---

## Phase 2: Box Border Tracing Animation
**Status**: Pending

**Goal**: Visual light that traces each edge of the box in sync with breathing phases

**Concept**:
```
    ← INHALE (top edge, left to right) ←
    ┌────────────────────────────────────┐
    │                                    │ ↓
  ↑ │                                    │ HOLD 1
HOLD│                                    │ (right edge)
  2 │                                    │ ↓
    └────────────────────────────────────┘
    → EXHALE (bottom edge, right to left) →
```

**Changes**:
- `index.html`: Add `<div class="box-tracer"></div>` inside `.circle-container`
- `style.css`: Tracer element styling (glowing dot, 12x12px)
- `style.css`: Four keyframe animations (`traceTop`, `traceRight`, `traceBottom`, `traceLeft`)
- `script.js`: Apply tracer animation based on current phase

**Verification**: Glowing dot traces top → right → bottom → left, 4s per edge

---

## Phase 3: Breathing State Visual Feedback
**Status**: Pending

**Goal**: Box "breathes" - expands on inhale, contracts on exhale, with glow changes

**Changes**:
- `style.css`: Refined scale animation (1.0 → 1.15, more subtle)
- `style.css`: Enhanced glow progression:
  - Inhale: Glow intensifies, border brightens
  - Hold: Steady bright glow
  - Exhale: Glow fades, border dims
- `style.css`: Inner box pulses in sync

**Verification**: Box grows brighter/larger on inhale, dims/contracts on exhale

---

## Phase 4: Audio Infrastructure
**Status**: Pending

**Goal**: Set up Web Audio API for generating subtle sounds

**Changes**:
- `script.js`: Audio context setup and `playTing(frequency, duration)` function
- `script.js`: `toggleAudio()` function with localStorage persistence
- `index.html`: Add audio toggle button
- `style.css`: Audio button styling

**Code Structure**:
```javascript
let audioContext = null;
let audioEnabled = true;

function initAudio() { /* Create AudioContext */ }
function playTing(frequency = 800, duration = 0.15) { /* Oscillator + gain */ }
function toggleAudio() { /* Toggle + save to localStorage */ }
```

**Verification**: `playTing()` produces soft chime, toggle button works

---

## Phase 5: Audio + Breathing Phase Integration
**Status**: Pending

**Goal**: Play distinct tones at each phase transition

**Phase Sounds**:
| Phase | Frequency | Feel |
|-------|-----------|------|
| Inhale | 600 Hz | Lower, rising |
| Hold 1 | 800 Hz | Mid |
| Exhale | 500 Hz | Lower, falling |
| Hold 2 | 700 Hz | Mid-low |

**Changes**:
- `script.js`: Define `phaseSounds` object
- `script.js`: Call `playTing()` at start of each phase in `runPhase()`
- `script.js`: Handle pause/resume (no extra sounds)

**Verification**: Eyes closed, hear 4 distinct tones guiding through cycle

---

## Files Modified
- `index.html` - Remove SVG ring, add tracer, add audio button
- `style.css` - Box animations, tracer, glow effects, audio button
- `script.js` - Remove progress ring, add tracer control, Web Audio API

## Notes

### Completed (Jan 2026)
- Removed inner-circle element, simplified to single box
- Changed color scheme from green (#84fab0) to blue (--accent vars)
- Tracer ball now continuous - no gaps between phase transitions
- Removed box scaling animation, kept glow pulse only
- Added subtle glow pulse during hold phases
- Added TEST_CASES.md for UX validation

### Current State
- App fully functional with all 4 session types
- Tracer traces box edges continuously through all phases
- Audio cues working with distinct tones per phase
- Responsive sizing with min(70vmin, 350px)

### Next Steps
- _TBD - awaiting user input_
