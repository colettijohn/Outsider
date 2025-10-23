# 🚀 Quick Start Guide - Testing The Oracle's Ritual

## Your Dev Server is Running!

**URL:** http://localhost:3001/

---

## 🧪 How to Test Everything

### Method 1: Access Test Pages via Admin Panel

1. **Open the game:** http://localhost:3001/
2. **Press any key** to access the console/admin
3. **Navigate to test pages:**
   - Type screen name in admin panel
   - Available screens: `polishTest`, `quickRitualTest`, `cardBrowserTest`, etc.

### Method 2: Direct URL Navigation

Open these URLs directly in your browser:

#### Test Pages (8 Total)
```
http://localhost:3001/  (then navigate via admin to):

- polishTest           → Test haptics, sounds, animations
- quickRitualTest      → Test Quick Ritual flow
- cardBrowserTest      → Test Card Browser
- oracleOrbTest        → Test Oracle Orb states
- oracleAITest         → Test AI recommendations
- oracleComponentsTest → Test UI components
- questionCardsTest    → Test question data
- featureTest          → Test feature flags
```

### Method 3: Play Through Normal Flow

1. Go to http://localhost:3001/
2. Click "Quick Ritual" or "Browse All Cards"
3. Experience the full Oracle's Ritual flow
4. Complete setup → Go to Lobby → Start Game

---

## 🎯 Quick Test Checklist

### Test Polish & Effects (5 minutes)
1. Navigate to **polishTest** screen
2. Test device capabilities (should show haptics/audio support)
3. Click haptic pattern buttons (feel vibrations on mobile)
4. Click sound effect buttons (hear audio feedback)
5. Click animation buttons (watch demo box animate)
6. Test enhanced components (button, slider, card)
7. Toggle settings (enable/disable haptics/sounds, adjust volume)

**Expected:** All buttons work, sounds play, animations smooth, haptics vibrate (on mobile)

---

### Test Quick Ritual Flow (2 minutes)
1. Navigate to **quickRitualTest** screen (or use normal flow)
2. Watch Oracle greeting
3. Answer 3 slider questions:
   - Seriousness (0-100)
   - Duration (0-100)
   - Spice (0-100)
4. Watch Oracle think
5. See 6 cards reveal (staggered animation)
6. Click "Begin Ritual"

**Expected:** 
- Smooth transitions between states
- Sounds play (whoosh, thinking, reveal, celebration)
- Haptics trigger (if on mobile)
- Cards appear with animation
- Takes ~30 seconds total

**Try Presets:**
- Click "Quick Game" / "Brain Teasers" / "Party Mix" / etc.
- Should skip questions and show instant results

---

### Test Card Browser (3 minutes)
1. Navigate to **cardBrowserTest** screen
2. **Search:** Type "science" → Should filter cards
3. **Filters:** 
   - Click "Filters" button
   - Select category (e.g., "Philosophy")
   - Select difficulty (e.g., "Medium")
   - Select spice level (e.g., "3")
4. **Quick Actions:**
   - Click "Random 10" → Should select 10 random cards
   - Click "Select All" → Should select all filtered cards
   - Click "Clear" → Should deselect all
5. **Collection Drawer:**
   - Click shopping cart icon (should hear drawer open sound)
   - See selected cards
   - Click "Remove" on a card
   - Click "Proceed to Lobby"

**Expected:**
- Real-time filtering works
- Search is instant
- Drawer slides up/down with sound
- Badge shows card count
- Validation warnings if < 5 cards

---

### Test Oracle AI (2 minutes)
1. Navigate to **oracleAITest** screen
2. Adjust preference sliders
3. Click "Get Recommendations"
4. See recommended cards with scores
5. Check reasoning
6. Try different preference combinations

**Expected:**
- Cards scored 0-100
- Higher scores for better matches
- Diverse categories
- Reasoning makes sense

---

### Test Oracle Components (3 minutes)
1. Navigate to **oracleComponentsTest** screen
2. **Buttons:** Test all variants and sizes
3. **Cards:** Flip cards, select cards
4. **Sliders:** Drag sliders, see gradient update
5. **Particles:** Watch different particle types
6. **Orb:** See different states

**Expected:**
- All variants render correctly
- Hover effects work
- Interactions smooth
- No visual glitches

---

## 🎮 Full Game Flow Test (5 minutes)

1. **Home Screen**
   - Should see "Quick Ritual" and "Browse All Cards" buttons
   - Click "Quick Ritual"

2. **Quick Ritual**
   - Answer 3 questions (or use preset)
   - Watch card reveal
   - Click "Begin Ritual"

3. **Lobby**
   - Should see selected questions
   - Add players
   - Start game

4. **Play Game**
   - Verify questions appear correctly
   - Complete full game flow

**Expected:** Seamless flow from setup to game

---

## 🔧 Troubleshooting

### No Sound Playing?
- Check browser allows audio (some browsers block until user interaction)
- Check volume in polishTest settings
- Check your device volume
- Try clicking anywhere first, then test sounds

### No Haptics?
- Only works on mobile devices with vibration support
- Enable vibration in device settings
- Check haptics toggle in polishTest settings
- Try on iOS Safari or Android Chrome

### Animations Choppy?
- Check "Reduce Motion" is OFF in OS accessibility settings
- Close other browser tabs
- Check browser console for errors

### Cards Not Showing?
- Check feature flags in `src/config/features.js`
- Verify `QUESTION_CARDS: true`
- Check browser console for errors
- Refresh page

### Feature Not Working?
1. Check `src/config/features.js` - relevant flag enabled?
2. Check browser console for errors
3. Try the specific test page for that feature
4. Verify you're on latest code (git pull)

---

## 📊 What to Look For

### Performance
- [ ] Animations smooth (60fps)
- [ ] No lag when clicking buttons
- [ ] Card reveal animation smooth
- [ ] Particle effects don't slow down page

### Audio/Haptics
- [ ] Sounds play immediately (no delay)
- [ ] Haptics feel responsive
- [ ] Volume control works
- [ ] Enable/disable toggles work

### UX Flow
- [ ] Quick Ritual completes in ~30 seconds
- [ ] Oracle personality comes through
- [ ] Card Browser feels intuitive
- [ ] Validation catches issues

### Visual Polish
- [ ] Gradients smooth
- [ ] Hover effects work
- [ ] No visual glitches
- [ ] Responsive on mobile

---

## 🐛 Found a Bug?

1. **Note the issue:**
   - What screen?
   - What action caused it?
   - What did you expect?
   - What actually happened?

2. **Check console:**
   - Open DevTools (F12)
   - Look for red errors
   - Copy error message

3. **Check feature flags:**
   - `src/config/features.js`
   - Is relevant feature enabled?

4. **Try test page:**
   - Isolate the specific feature
   - Does it work in isolation?

---

## ✅ Final Checklist

Before marking as "tested":

- [ ] Visited polishTest page - all features work
- [ ] Completed Quick Ritual flow - smooth experience
- [ ] Used Card Browser - filtering works
- [ ] Tested on mobile device - haptics work
- [ ] Tried all presets - instant results
- [ ] Played full game - questions appear correctly
- [ ] No console errors
- [ ] Performance acceptable

---

## 🎉 Ready to Launch?

Once testing complete:

1. **Review documentation:**
   - Read `TESTING_CHECKLIST.md` for comprehensive tests
   - Read `FEATURE_FLAG_ROLLOUT.md` for launch strategy
   - Read `ORACLE_DOCUMENTATION.md` for complete reference

2. **Enable feature flag:**
   - `NEW_CUSTOMIZE_SCREEN: true` in `src/config/features.js`

3. **Deploy:**
   - Follow your normal deployment process
   - Monitor analytics
   - Watch for errors

4. **Celebrate!** 🎊
   - You built something amazing
   - Users will love it
   - Well done!

---

## 📞 Quick Reference

**Dev Server:** http://localhost:3001/
**Test Pages:** 8 total (use admin panel to navigate)
**Documentation:** 5 comprehensive guides in project root
**Feature Flags:** `src/config/features.js`
**Git Status:** All code committed and pushed to main

**Status: ✅ READY FOR TESTING**

---

**Happy Testing!** 🧪✨

If you encounter any issues, check the TROUBLESHOOTING section in `ORACLE_DOCUMENTATION.md` or review the test-specific pages for isolated testing.
