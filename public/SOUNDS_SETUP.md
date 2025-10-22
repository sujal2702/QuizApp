# Sound Files Setup

To enable sound effects, add the following audio files to `public/sounds/`:

## Required Sound Files:

1. **correct.mp3** - Positive ding sound (correct answer)
2. **wrong.mp3** - Buzz or error sound (wrong answer)  
3. **tick.mp3** - Clock tick (timer running)
4. **countdown.mp3** - Urgent beeping (last 5 seconds)
5. **applause.mp3** - Clapping (quiz end, winner)
6. **whoosh.mp3** - Swoosh sound (transitions, join)
7. **join.mp3** - Pop sound (student joins)
8. **bell.mp3** - School bell (question opens)
9. **success.mp3** - Success chime (answer submitted)
10. **powerup.mp3** - Game power-up sound (streak bonus)

## Free Sound Resources:

### Option 1: Freesound.org
- https://freesound.org/
- Search for each sound type
- Download as MP3 or OGG
- Free with attribution

### Option 2: Zapsplat
- https://www.zapsplat.com/
- Free sound effects
- Game UI sounds section

### Option 3: Mixkit
- https://mixkit.co/free-sound-effects/
- Free sound effects
- No attribution required

### Option 4: Create with AI
- Use https://elevenlabs.io/ for sound generation
- Or use free tools like Beepbox

## Installation:

1. Create directory:
   ```bash
   mkdir public/sounds
   ```

2. Add your MP3 files to `public/sounds/`

3. Files should be:
   - Short (0.5-2 seconds)
   - Small file size (<50KB each)
   - MP3 format for compatibility
   - Sample rate: 44.1kHz

## Fallback:

If you don't add sound files, the app will still work - sounds just won't play. No errors will occur.

## Testing:

Open browser console and type:
```javascript
import { playSound } from './utils/sounds';
playSound('correct'); // Should hear sound
```
