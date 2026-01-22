# Box Breathing App - UX Test Cases

## Session Selection

### TC1: Session cards display
- [ ] All 4 session types visible (Quick Calm, Deep Relaxation, Focus, Custom)
- [ ] Each card shows title, duration, description
- [ ] Hover effect works on cards

### TC2: Session start
- [ ] Clicking a session card transitions to breathing view
- [ ] Session info displays correct duration/cycles
- [ ] Start button visible, Pause button hidden

---

## Breathing Animation

### TC3: Tracer ball continuous motion
- [ ] Tracer ball visible immediately when breathing starts
- [ ] Tracer moves along TOP edge during "Breathe In" (left→right)
- [ ] Tracer moves along RIGHT edge during first "Hold" (top→bottom)
- [ ] Tracer moves along BOTTOM edge during "Breathe Out" (right→left)
- [ ] Tracer moves along LEFT edge during second "Hold" (bottom→top)
- [ ] **NO gaps or flicker** between phase transitions
- [ ] Tracer completes full loop and repeats

### TC4: Box glow animation
- [ ] Box glow intensifies during Inhale
- [ ] Box glow pulses subtly during Hold phases
- [ ] Box glow dims during Exhale
- [ ] Glow transitions are smooth

### TC5: Timing accuracy
- [ ] Each phase lasts exactly 4 seconds
- [ ] Timer counts down 4→3→2→1→0 for each phase
- [ ] Full cycle = 16 seconds (4 phases × 4 sec)

---

## Audio

### TC6: Phase transition sounds
- [ ] Distinct tone plays at start of each phase
- [ ] Inhale tone (600Hz) - lower pitch
- [ ] Hold tones (700-800Hz) - mid pitch
- [ ] Exhale tone (500Hz) - lowest pitch
- [ ] Sounds are subtle, not jarring

### TC7: Audio toggle
- [ ] Audio button visible during session
- [ ] Clicking toggles audio on/off
- [ ] Icon updates to reflect state (🔊/🔇)
- [ ] Preference persists after page reload

---

## Controls

### TC8: Pause/Resume
- [ ] Pause button appears after starting
- [ ] Clicking Pause stops all animations
- [ ] Tracer freezes in place
- [ ] Timer stops counting
- [ ] Button text changes to "Resume"
- [ ] Clicking Resume continues from paused position
- [ ] No audio plays on resume

### TC9: Back navigation
- [ ] Back button returns to session selection
- [ ] All animations/timers stop
- [ ] Progress resets

### TC10: Keyboard shortcuts
- [ ] Space starts session from selection screen
- [ ] Space pauses/resumes during breathing
- [ ] Escape goes back to selection

---

## Session Completion

### TC11: Timed session end
- [ ] Session ends after correct number of cycles
- [ ] "Session Complete" message displays
- [ ] Congratulations text appears
- [ ] Start New Session button visible

### TC12: Progress tracking
- [ ] Cycle counter updates correctly (e.g., "Cycle 2 of 3")
- [ ] Progress reflects actual completion

---

## Responsive/Edge Cases

### TC13: Mobile display
- [ ] Box and tracer scale appropriately on small screens
- [ ] All buttons tappable
- [ ] Text readable

### TC14: Rapid interactions
- [ ] Quickly pausing/resuming doesn't break animation
- [ ] Starting new session while one is running works
- [ ] Multiple rapid clicks don't cause issues
