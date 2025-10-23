# 🎮 Access Oracle's Ritual Screens - Quick Guide

## 🔐 How to Access the Admin Panel

### Step 1: Open Admin Panel
Press **`Shift + A`** or click the settings icon

### Step 2: Enter Password
Type: **`0`** (zero)

### Step 3: Navigate!
You'll see the Navigation tab with these buttons:

---

## 🎴 Available Screens in Admin Panel

### Navigation Tab:

| Button | Screen | Description |
|--------|--------|-------------|
| **Home** | Home Screen | Main menu |
| **⚡ Quick Ritual** | Quick Ritual | 30-second Oracle-guided setup |
| **🎴 Full Customize** | Full Customize | Complete customization with all options |
| **📚 Card Browser** | Card Browser | Browse all question cards |
| **Lobby** | Lobby | Game lobby |
| **Game** | Game | Active game screen |
| **Debate** | Debate | Debate phase |
| **Voting** | Voting | Voting phase |
| **Scoreboard** | Scoreboard | Round results |
| **Game Over** | Game Over | Final results |

---

## ⚡ Quick Ritual Screen Features

**What it is:** Oracle-guided 30-second game setup

**Features:**
- 🎯 3 simple slider questions
- 🔮 AI-powered recommendations
- ⚡ Super fast setup
- ✨ Mystical Oracle experience
- 🎴 Automatic card selection

**Flow:**
1. Oracle greets you (3s)
2. Answer 3 questions with sliders (15s)
3. Oracle thinks (3s)
4. Cards revealed (6s)
5. Confirm & start (3s)

**Perfect for:** Quick games, new players, casual sessions

---

## 🎴 Full Customize Screen Features

**What it is:** Complete game customization with all options

**Features:**
- 📚 Browse all 100+ question cards
- 🏷️ Filter by categories (Light, Deep, Spicy, etc.)
- 🔍 Search cards
- ⭐ Mark favorites
- 🎲 Random selection
- 💾 Save presets
- ⚙️ Advanced game settings

**Sections:**
1. **Card Browser:** View and select cards
2. **Filters:** Category, difficulty, type
3. **Settings:** Players, rounds, time limits
4. **Presets:** Save/load configurations

**Perfect for:** Experienced players, custom themes, specific moods

---

## 📚 Card Browser Screen Features

**What it is:** Full library of question cards without game setup

**Features:**
- 📖 Browse all cards
- 🏷️ Filter by categories
- 🔍 Search functionality
- 📊 View card stats
- 💡 Read full questions
- 🎨 See card themes

**Perfect for:** Exploring questions, preparing games, inspiration

---

## 🎯 Testing Workflow

### Test Quick Ritual:
1. Open Admin Panel (`Shift + A`, password: `0`)
2. Click **"⚡ Quick Ritual"**
3. Follow Oracle's guidance
4. Test the 30-second flow
5. Check card recommendations

### Test Full Customize:
1. Open Admin Panel
2. Click **"🎴 Full Customize"**
3. Browse cards
4. Test filters
5. Try creating a preset
6. Configure game settings

### Test Card Browser:
1. Open Admin Panel
2. Click **"📚 Card Browser"**
3. Browse the library
4. Test search
5. Test filters

---

## 🔧 Admin Panel Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Admin Panel | `Shift + A` |
| Close any modal | `Escape` |
| Show keyboard shortcuts | `?` |
| Show rules | `R` |

---

## 🎮 Full Testing Checklist

### Quick Ritual Testing:
- [ ] Oracle greeting plays
- [ ] Sliders work smoothly
- [ ] Progress indicator shows
- [ ] Oracle thinking animation
- [ ] Cards reveal with animation
- [ ] Can adjust preferences
- [ ] Can browse all cards
- [ ] Navigates to lobby correctly

### Full Customize Testing:
- [ ] All cards load
- [ ] Filters work
- [ ] Search works
- [ ] Card selection works
- [ ] Presets save/load
- [ ] Settings apply
- [ ] Navigates to lobby

### Card Browser Testing:
- [ ] All cards visible
- [ ] Categories filter properly
- [ ] Search finds cards
- [ ] Card details show
- [ ] Smooth scrolling
- [ ] Back button works

---

## 🚀 Feature Flags Status

Make sure these are enabled in `src/config/features.js`:

```javascript
NEW_CUSTOMIZE_SCREEN: true,     // Main feature flag
QUICK_RITUAL: true,              // Quick setup
ORACLE_AI: true,                 // AI recommendations
CARD_BROWSER: true,              // Card browsing
ADVANCED_FILTERS: true,          // Filter system
PRESET_SYSTEM: true,             // Save/load presets
```

---

## 🎨 Visual Features to Check

### Quick Ritual:
- ✅ Oracle orb animates
- ✅ Particle effects
- ✅ Gradient backgrounds
- ✅ Smooth transitions
- ✅ Card flip animations
- ✅ Glitch text effects

### Full Customize:
- ✅ Card grid layout
- ✅ Hover effects
- ✅ Filter animations
- ✅ Modal overlays
- ✅ Loading states
- ✅ Success messages

---

## 📊 What to Look For

### User Experience:
- Is navigation intuitive?
- Are instructions clear?
- Do animations feel smooth?
- Is text readable?
- Are buttons responsive?

### Functionality:
- Do sliders work properly?
- Are cards loading correctly?
- Do filters apply?
- Does search work?
- Do presets save?

### Performance:
- Does it load quickly?
- Are animations smooth?
- Any lag or stuttering?
- Memory usage okay?

---

## 🐛 Common Issues & Fixes

### "Quick Ritual button does nothing"
**Fix:** Feature flags might be disabled
- Check `src/config/features.js`
- Ensure `NEW_CUSTOMIZE_SCREEN: true`

### "Cards not loading"
**Fix:** Check questions.json
- Verify file exists in `src/data/`
- Check console for errors

### "Oracle not speaking"
**Fix:** Check OracleAI service
- Verify `src/services/OracleAI.js` exists
- Check browser console

### "Navigation doesn't work"
**Fix:** Check GameContext
- Verify `setGameState` function
- Check screen routing in App.jsx

---

## 🎉 Success Criteria

Your Oracle's Ritual is working if:

✅ Admin panel opens with password `0`  
✅ Can navigate to Quick Ritual  
✅ Can navigate to Full Customize  
✅ Can navigate to Card Browser  
✅ Oracle greets and guides you  
✅ Sliders respond smoothly  
✅ Cards load and display  
✅ Filters work  
✅ Can create and start a game  

---

## 🚀 Next Steps After Testing

1. ✅ Test all three screens thoroughly
2. ✅ Take screenshots/videos
3. ✅ Share with friends for feedback
4. ✅ Deploy to production (Cloudflare)
5. ✅ Announce the new features!

---

**Enjoy exploring The Oracle's Ritual!** 🔮✨

Your revolutionary game customization system is ready! 🎮
