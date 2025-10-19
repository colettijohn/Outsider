# Contributing to Outsider: Cosmic Council

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Component Guidelines](#component-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

---

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Accept responsibility for mistakes
- Prioritize the community's best interests

### Unacceptable Behavior

- Harassment, discrimination, or trolling
- Publishing private information
- Spam or off-topic content
- Any conduct that could be deemed unprofessional

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- Git
- Code editor (VS Code recommended)

### Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/Outsider.git
cd Outsider
npm install
npm run dev
```

### Project Setup

The project uses:
- **React 18.2** with Hooks
- **Vite 5.0** for building
- **Tailwind CSS** (CDN) for styling
- **Lucide Icons** (CDN) for icons

---

## 💻 Development Workflow

### Branch Strategy

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bugfix branch
git checkout -b fix/bug-description
```

### Development Process

1. **Make Changes** - Edit files in `src/`
2. **Test Locally** - Run `npm run dev` and test in browser
3. **Check Errors** - Ensure no console errors
4. **Commit Changes** - Use descriptive commit messages
5. **Push Branch** - Push to your fork
6. **Open PR** - Create pull request to main repo

### Commit Message Format

```
type(scope): brief description

Longer description if needed

Fixes #123
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Build, dependencies, etc.

**Examples:**
```bash
git commit -m "feat(chat): add emoji support to chat messages"
git commit -m "fix(voting): prevent double-voting bug"
git commit -m "docs(readme): update installation instructions"
```

---

## 📝 Coding Standards

### JavaScript/JSX Style

**Use functional components with Hooks:**
```jsx
// ✅ Good
const MyComponent = ({ title, onClick }) => {
  const [count, setCount] = useState(0)
  return <button onClick={onClick}>{title}: {count}</button>
}

// ❌ Avoid
class MyComponent extends React.Component { ... }
```

**Use destructuring:**
```jsx
// ✅ Good
const { gameState, players } = useGame()

// ❌ Avoid
const context = useGame()
const gameState = context.gameState
```

**Use arrow functions for event handlers:**
```jsx
// ✅ Good
const handleClick = () => {
  console.log('Clicked')
}

// ❌ Avoid
function handleClick() { ... }
```

### Naming Conventions

- **Components**: PascalCase (`MyComponent.jsx`)
- **Functions**: camelCase (`handleSubmit`, `calculateScore`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_PLAYERS`)
- **CSS Classes**: kebab-case (`cosmic-background`)

### File Organization

```
src/components/
├── MyComponent.jsx          # Component file
└── README.md               # Component documentation (if complex)

src/utils/
├── helpers.js              # Helper functions
└── constants.js            # Constants

src/styles/
└── main.css                # All CSS (centralized)
```

---

## 🧩 Component Guidelines

### Component Structure

```jsx
import React, { useState, useEffect } from 'react'
import { useGame } from '../contexts/GameContext'
import SomeChildComponent from './SomeChildComponent'

/**
 * ComponentName - Brief description
 * @param {string} title - Title prop description
 * @param {function} onClick - Click handler description
 */
const ComponentName = ({ title, onClick }) => {
  // 1. Context hooks
  const { gameState } = useGame()
  
  // 2. State hooks
  const [isActive, setIsActive] = useState(false)
  
  // 3. Effect hooks
  useEffect(() => {
    // Side effects
  }, [dependencies])
  
  // 4. Event handlers
  const handleClick = () => {
    onClick()
  }
  
  // 5. Render logic
  if (!gameState) return null
  
  // 6. JSX return
  return (
    <div className="container">
      <h1>{title}</h1>
      <button onClick={handleClick}>Click</button>
    </div>
  )
}

export default ComponentName
```

### Props Documentation

Use JSDoc comments:
```jsx
/**
 * PlayerCard component - Displays player information
 * @param {object} player - Player object
 * @param {string} player.id - Unique player ID
 * @param {string} player.nickname - Player nickname
 * @param {number} player.score - Current score
 * @param {boolean} isHost - Whether player is host
 * @param {function} onKick - Callback when player is kicked
 */
```

### State Management

**Local state** for UI-only concerns:
```jsx
const [isOpen, setIsOpen] = useState(false)
```

**Context** for game state:
```jsx
const { gameState, players, handleVote } = useGame()
```

### Performance

**Memoize expensive computations:**
```jsx
const sortedPlayers = useMemo(() => {
  return [...players].sort((a, b) => b.score - a.score)
}, [players])
```

**Memoize callbacks:**
```jsx
const handleSubmit = useCallback(() => {
  // Handler logic
}, [dependencies])
```

---

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, test:

1. **Home Screen**
   - Create room works
   - Join room works
   - Validation works

2. **Game Flow**
   - Can complete full game
   - Scoring is correct
   - No console errors

3. **Responsive Design**
   - Test on desktop (1920x1080)
   - Test on tablet (768x1024)
   - Test on mobile (375x667)

4. **Browser Compatibility**
   - Chrome/Edge
   - Firefox
   - Safari

### Testing New Features

```bash
# Start dev server
npm run dev

# Test in browser
# Check browser console for errors
# Test all affected features
# Test edge cases
```

---

## 📤 Submitting Changes

### Pull Request Process

1. **Update Documentation** - If you changed functionality, update README
2. **Test Thoroughly** - Follow testing checklist
3. **Clean Commit History** - Squash if needed
4. **Write PR Description** - Explain what and why
5. **Link Issues** - Reference related issues

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing Done
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested responsive design
- [ ] No console errors

## Screenshots (if applicable)
[Add screenshots]

## Related Issues
Closes #123
```

### Review Process

1. Maintainer reviews code
2. Automated checks run (if configured)
3. Request changes or approve
4. Merge when approved

---

## 🎨 Adding New Features

### New Question Category

1. Add questions to `src/data/questions.json`:
```json
{
  "New Category": [
    {
      "crew": "Entity question",
      "impostor": "Anomaly question"
    }
  ]
}
```

2. Add constellation to `src/data/constellationLayouts.js`:
```javascript
"New Category": {
  name: "Display Name",
  stars: [{ x: 50, y: 20 }, { x: 30, y: 40 }],
  lines: [[0, 1]]
}
```

3. Update `ATLAS_CATEGORIES` in `CustomizeGameScreen.jsx`

### New Component

1. Create `src/components/NewComponent.jsx`
2. Add JSDoc documentation
3. Export as default
4. Import where needed
5. Update component count in docs

### New Feature

1. Plan architecture
2. Create necessary components
3. Update GameContext if needed
4. Test thoroughly
5. Document in README

---

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 95]
- Screen Size: [e.g., 1920x1080]
```

### Where to Report

- GitHub Issues for bugs
- Discussions for questions
- Email for security issues

---

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description**
Clear description of proposed feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How might this be implemented?

**Alternatives Considered**
Other approaches you've thought about
```

---

## 📚 Resources

### Documentation

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

### Project Docs

- `README.md` - Project overview
- `STEP_*_COMPLETE.md` - Refactoring history
- `STEP_7_TESTING_GUIDE.md` - Testing procedures

### Getting Help

- Read existing documentation
- Search existing issues
- Ask in Discussions
- Reach out to maintainers

---

## 🎯 Good First Issues

Looking to contribute? Start with:

- 🐛 Bug fixes (check Issues labeled "good first issue")
- 📝 Documentation improvements
- 🎨 UI polish and small enhancements
- 🧪 Adding tests
- 🌐 Accessibility improvements

---

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You!

Every contribution, no matter how small, helps make Outsider: Cosmic Council better!

**Happy Contributing! 🌌✨**
