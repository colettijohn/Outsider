# Feature Flag Rollout Guide

## 🎛️ Overview
This document describes the feature flag system for "The Oracle's Ritual" and provides step-by-step instructions for safe rollout.

---

## 📂 Feature Flag System

### Location
**File:** `src/config/features.js`

### Structure
```javascript
export const features = {
  NEW_CUSTOMIZE_SCREEN: true,  // Master switch
  QUICK_RITUAL: true,
  CARD_BROWSER: true,
  ORACLE_AI: true,
  ORACLE_ORB: true,
  ORACLE_COMPONENTS: true,
  PARTICLE_EFFECTS: true,
  HAPTIC_FEEDBACK: true,
  SOUND_EFFECTS: true,
  MICRO_ANIMATIONS: true,
  QUESTION_CARDS: true
}
```

---

## 🚦 Master Switch: NEW_CUSTOMIZE_SCREEN

### Purpose
Controls whether users see the new "Oracle's Ritual" experience or the legacy CustomizeGameScreen.

### When Enabled (true)
- Home screen shows "Quick Ritual" and "Browse All Cards" buttons
- Users flow through QuickRitualScreen or CardBrowserScreen
- Oracle AI recommends questions
- Full polish effects active

### When Disabled (false)
- Home screen shows "Customize Game" button
- Users flow through legacy CustomizeGameScreen
- Manual question selection
- No Oracle features

### Toggle Command
```javascript
// In src/config/features.js
export const features = {
  NEW_CUSTOMIZE_SCREEN: false,  // Instant rollback
  // ... rest unchanged
}
```

**Effect:** Instant revert to old experience (no code changes needed)

---

## 🎚️ Sub-Feature Flags

### 1. QUICK_RITUAL
**Controls:** QuickRitualScreen availability

**When Disabled:**
- "Quick Ritual" button hidden on Home
- Direct navigation to Card Browser
- Removes 30-second setup flow

**Use Case:** Disable if Quick Ritual has issues but Card Browser works

---

### 2. CARD_BROWSER
**Controls:** CardBrowserScreen availability

**When Disabled:**
- "Browse All Cards" button hidden
- Only Quick Ritual available
- Removes advanced selection

**Use Case:** Disable if Card Browser has issues but Quick Ritual works

---

### 3. ORACLE_AI
**Controls:** OracleAI recommendation engine

**When Disabled:**
- Quick Ritual uses random selection
- No intelligent scoring
- No validation warnings
- Presets use hardcoded lists

**Use Case:** Disable if AI recommendations are poor

---

### 4. ORACLE_ORB
**Controls:** OracleOrb component

**When Disabled:**
- Shows static text instead of animated orb
- No state transitions
- Removes typewriter effect

**Use Case:** Disable if orb animations cause performance issues

---

### 5. ORACLE_COMPONENTS
**Controls:** Oracle UI components (Button, Card, Slider)

**When Disabled:**
- Falls back to standard HTML elements
- Removes custom styling
- Removes shimmer effects

**Use Case:** Disable if custom components have bugs

---

### 6. PARTICLE_EFFECTS
**Controls:** ParticleEffect component

**When Disabled:**
- Removes all particle animations
- Static backgrounds
- Improves performance on low-end devices

**Use Case:** Disable for performance optimization

---

### 7. HAPTIC_FEEDBACK
**Controls:** Haptic feedback system

**When Disabled:**
- No vibrations
- Enhanced components work without haptics
- Improves battery life

**Use Case:** Disable if haptics are annoying or draining battery

---

### 8. SOUND_EFFECTS
**Controls:** Sound effects system

**When Disabled:**
- Silent mode
- Enhanced components work without sounds
- No audio processing

**Use Case:** Disable if audio causes issues or is unwanted

---

### 9. MICRO_ANIMATIONS
**Controls:** CSS micro-animations

**When Disabled:**
- Instant transitions
- No scale/shake/wiggle effects
- Respects reduced motion preference

**Use Case:** Disable for accessibility or performance

---

### 10. QUESTION_CARDS
**Controls:** Question card data structure

**When Disabled:**
- Falls back to legacy questions.json format
- No metadata (difficulty, spice, tags)
- Basic question list

**Use Case:** Disable if card metadata is incorrect

---

## 🔄 Rollout Phases

### Phase 0: Pre-Launch (Current)
**Status:** Development complete, testing in progress

**Flags:**
```javascript
NEW_CUSTOMIZE_SCREEN: false  // Disabled for everyone
```

**Action:** None (old experience for all users)

---

### Phase 1: Internal Testing (Week 1)

**Goal:** Verify all features work correctly

**Flags:**
```javascript
NEW_CUSTOMIZE_SCREEN: true  // Enable for dev team only
```

**Implementation:**
1. Add user check in App.jsx:
```javascript
const isDev = gameState.players.find(p => p.isDev)
const useNewFlow = features.NEW_CUSTOMIZE_SCREEN && isDev
```

2. Test extensively using TESTING_CHECKLIST.md

3. Fix any critical bugs

**Success Criteria:**
- Zero critical bugs
- All test cases pass
- Dev team approves

---

### Phase 2: Soft Launch (Week 2)

**Goal:** Validate with real users (10%)

**Flags:**
```javascript
NEW_CUSTOMIZE_SCREEN: true  // Enable for 10% of users
```

**Implementation:**
1. Add random user sampling:
```javascript
const userId = localStorage.getItem('userId') || generateUserId()
const userBucket = hashCode(userId) % 100
const useNewFlow = features.NEW_CUSTOMIZE_SCREEN && userBucket < 10
```

2. Set up analytics tracking:
```javascript
analytics.track('customize_screen_shown', {
  version: useNewFlow ? 'oracle_ritual' : 'legacy',
  userId: userId
})
```

3. Monitor key metrics:
   - Completion rate
   - Time to complete
   - Error rate
   - User feedback

**Success Criteria:**
- Completion rate > 80%
- No error spikes
- Positive feedback
- Performance acceptable

---

### Phase 3: Gradual Rollout (Week 3-4)

**Goal:** Increase exposure gradually

**Week 3:**
```javascript
const useNewFlow = features.NEW_CUSTOMIZE_SCREEN && userBucket < 25  // 25%
```

**Week 4:**
```javascript
const useNewFlow = features.NEW_CUSTOMIZE_SCREEN && userBucket < 50  // 50%
```

**Monitor at each stage:**
- User engagement metrics
- Error rates
- Performance metrics
- User feedback

**Decision Point:** If metrics decline, pause or rollback

---

### Phase 4: Full Launch (Week 5)

**Goal:** Enable for all users

**Flags:**
```javascript
NEW_CUSTOMIZE_SCREEN: true  // 100% of users
```

**Implementation:**
```javascript
const useNewFlow = features.NEW_CUSTOMIZE_SCREEN  // No sampling
```

**Post-Launch:**
- Monitor for 1 week
- Address any issues
- Celebrate success! 🎉

---

### Phase 5: Cleanup (Week 6+)

**Goal:** Remove feature flags and old code

**Actions:**
1. Remove feature flag checks
2. Delete legacy CustomizeGameScreen.jsx
3. Clean up conditional logic
4. Update documentation

---

## 📊 Analytics Tracking

### Events to Track

#### Setup Flow
```javascript
// Flow started
analytics.track('customize_flow_started', {
  version: 'oracle_ritual' | 'legacy',
  entryPoint: 'quick_ritual' | 'card_browser'
})

// Flow completed
analytics.track('customize_flow_completed', {
  version: 'oracle_ritual' | 'legacy',
  timeSpent: timeInSeconds,
  cardCount: selectedCards.length,
  usedPreset: boolean
})

// Flow abandoned
analytics.track('customize_flow_abandoned', {
  version: 'oracle_ritual' | 'legacy',
  step: 'q1' | 'q2' | 'q3' | 'revealing' | 'browsing',
  timeSpent: timeInSeconds
})
```

#### Interactions
```javascript
// Preset selected
analytics.track('preset_selected', {
  preset: 'quick_game' | 'brain_teasers' | 'party_mix' | 'cosmic_journey' | 'bold_debate'
})

// Card selected
analytics.track('card_selected', {
  cardId: string,
  method: 'click' | 'quick_action' | 'preset' | 'ai_recommendation'
})

// Filter used
analytics.track('filter_used', {
  filterType: 'category' | 'difficulty' | 'spice' | 'search',
  filterValue: string
})
```

#### Polish Features
```javascript
// Haptics used
analytics.track('haptics_triggered', {
  pattern: 'light' | 'medium' | 'heavy' | 'success' | etc.
})

// Sound played
analytics.track('sound_played', {
  sound: 'click' | 'whoosh' | 'celebration' | etc.
})

// Settings changed
analytics.track('polish_settings_changed', {
  haptics: boolean,
  sounds: boolean,
  volume: number
})
```

### Key Metrics

#### Completion Metrics
- **Setup Completion Rate:** % of users who complete customization
- **Time to Complete:** Average time from start to lobby
- **Drop-off Points:** Where users abandon the flow

#### Engagement Metrics
- **Quick Ritual Usage:** % choosing Quick Ritual vs Card Browser
- **Preset Usage:** % using presets vs manual selection
- **Card Browser Actions:** Average filters/searches per session

#### Quality Metrics
- **Error Rate:** JavaScript errors per session
- **Performance:** Page load time, animation FPS
- **Satisfaction:** User ratings, feedback sentiment

---

## 🚨 Rollback Procedures

### Instant Rollback (< 5 minutes)

**Scenario:** Critical bug discovered

**Action:**
```javascript
// In src/config/features.js
export const features = {
  NEW_CUSTOMIZE_SCREEN: false,  // ROLLBACK
  // ... rest unchanged
}
```

**Deploy:**
```bash
git add src/config/features.js
git commit -m "ROLLBACK: Disable Oracle Ritual due to [ISSUE]"
git push origin main
```

**Result:** All users instantly see legacy experience

---

### Partial Rollback (< 10 minutes)

**Scenario:** Specific sub-feature has issues

**Action:**
```javascript
// Disable problematic feature only
export const features = {
  NEW_CUSTOMIZE_SCREEN: true,
  QUICK_RITUAL: true,
  CARD_BROWSER: true,
  ORACLE_AI: true,
  ORACLE_ORB: false,  // Disable this only
  ORACLE_COMPONENTS: true,
  PARTICLE_EFFECTS: false,  // Disable this too
  HAPTIC_FEEDBACK: true,
  SOUND_EFFECTS: true,
  MICRO_ANIMATIONS: true,
  QUESTION_CARDS: true
}
```

**Result:** New flow continues, but without problematic features

---

### Gradual Rollback (< 30 minutes)

**Scenario:** Issues affect only some users

**Action:**
```javascript
// Reduce percentage
const useNewFlow = features.NEW_CUSTOMIZE_SCREEN && userBucket < 10  // Back to 10%
```

**Result:** Fewer users affected while issue is investigated

---

## 🔍 Monitoring Setup

### Error Tracking
```javascript
// In App.jsx or ErrorBoundary
try {
  // Oracle features
} catch (error) {
  errorTracker.log({
    error: error.message,
    stack: error.stack,
    feature: 'oracle_ritual',
    screen: gameState.screen,
    userId: userId
  })
}
```

### Performance Monitoring
```javascript
// Track key timings
performance.mark('oracle_ritual_start')
// ... flow happens
performance.mark('oracle_ritual_end')
performance.measure('oracle_ritual_duration', 
  'oracle_ritual_start', 
  'oracle_ritual_end'
)
```

### User Feedback
```javascript
// Feedback widget
<FeedbackButton 
  feature="oracle_ritual"
  onSubmit={(rating, comment) => {
    analytics.track('feedback_submitted', {
      feature: 'oracle_ritual',
      rating: rating,
      comment: comment
    })
  }}
/>
```

---

## 📞 Communication Plan

### Internal Communication

**Before Launch:**
- Team briefing on new features
- Demo for stakeholders
- QA walkthrough

**During Rollout:**
- Daily standup updates
- Slack channel for issues
- Emergency contact list

**After Launch:**
- Success metrics shared
- Lessons learned document
- Team celebration

### User Communication

**Soft Launch:**
- No announcement (silent test)
- Monitor feedback channels
- Gather qualitative feedback

**Full Launch:**
- Blog post announcement
- Social media posts
- In-app notification
- Email to users (optional)

---

## ✅ Pre-Launch Checklist

- [ ] All feature flags documented
- [ ] Analytics tracking implemented
- [ ] Error monitoring setup
- [ ] Performance monitoring setup
- [ ] Rollback procedure tested
- [ ] Team trained on feature flags
- [ ] Communication plan ready
- [ ] Success metrics defined
- [ ] Monitoring dashboard created
- [ ] Emergency contacts documented

---

## 🎉 Success Celebration

When rollout completes successfully:
1. Share success metrics with team
2. Thank contributors
3. Document lessons learned
4. Plan Phase 5 cleanup
5. Celebrate! 🎊

---

**Last Updated:** October 21, 2025
**Version:** 1.0
**Status:** Ready for Rollout
