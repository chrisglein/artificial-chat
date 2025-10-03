# Artificial Chat - React Native for Windows

Artificial Chat is a React Native for Windows application exploring conversational AI with rich markdown, code highlighting, and image generation.

## Quick Start

### Prerequisites
- **Node.js 18+** (`node --version`)
- **Yarn** (`yarn --version`)
- **Windows OS required** for full builds (Linux/macOS for JavaScript only)

### Setup and Build
```bash
# Install dependencies (~60 seconds, NEVER CANCEL)
yarn install

# JavaScript development (all platforms)
npx react-native start  # Metro bundler on port 8081

# Windows build (Windows only, 5-30 minutes first time)
yarn windows            # Debug build
yarn windows --release  # Release build

# Quality checks
yarn lint              # Check code quality
yarn test              # Run tests (Windows only)
```

### Windows Build Prerequisites
Run once in elevated PowerShell:
```powershell
node_modules/react-native-windows/Scripts/rnw-dependencies.ps1
```
More info: https://microsoft.github.io/react-native-windows/docs/rnw-dependencies

## Project Structure

See detailed instructions for specific directories:
- **[`src/` - JavaScript/TypeScript code](.github/copilot-instructions-src.md)**
- **[`windows/` - Windows native code](.github/copilot-instructions-windows.md)**

### Key Files
- `src/App.tsx` - Root component with contexts (Styles, Settings, Popups)
- `src/ChatSession.tsx` - Chat history and state management
- `src/AiQuery.tsx` - OpenAI integration
- `src/Settings.tsx` - Settings dialog
- `package.json` - Dependencies and scripts
- `.eslintrc.js` - Linting rules

## Development Workflow

### Before Changes
1. Start Metro bundler: `npx react-native start`
2. Check baseline: `yarn lint`
3. Verify current state works

### During Development
- Keep Metro bundler running for fast iteration
- Test incrementally (settings dialog, chat input, etc.)
- Use React Native debugger for UI issues

### Before Completing
1. **ALWAYS run `yarn lint`** - CI requires clean lint
2. **ALWAYS verify Metro bundler compiles**
3. On Windows: Build and manually test (`yarn windows`)
4. Test core scenarios: settings, chat, AI responses

## Best Practices

### Code Changes
- **Make minimal changes** - only modify what's necessary for the fix/feature
- **Don't mix concerns** - separate functional changes from style/lint fixes
- **Fix lint only on modified lines** unless the PR is specifically for linting
- **Follow existing patterns** - match the style of surrounding code

### Testing
- **Test product code, not tests** - avoid tests that only verify test setup
- **Use existing test patterns** - match the structure of current tests  
- **Tests must run on Windows** - Jest config requires RNW dependencies

### File Changes
- OpenAI integration: `AiQuery.tsx`, `OpenAI.tsx`
- UI styling: `Styles.tsx` (use theme, never hardcode colors)
- New components: Follow patterns in `Controls.tsx`
- Chat flow: `ChatSession.tsx` (readonly ChatHistoryContext)

## PR and Commit Guidelines

### Commit Messages
Write good commit messages that:
- **Capture WHY (context), not what/how** - git diff shows what changed
- **Are succinct** - one line summary, optional detailed body
- **Use imperative mood** - "Fix bug" not "Fixing" or "Fixed"

Good examples:
- `Fix crash when API key is empty`
- `Add image generation support`
- `Improve error messages for API failures`

Reference: https://cbea.ms/git-commit/

### PR Titles
- **Short summary in imperative mood** - "Fix", "Add", "Improve" (not "Fixing", "Fixed")
- **Describe the change, not the issue** - title should stand alone

## Common Issues

### Linting
- Baseline has existing lint issues (don't fix unrelated issues)
- Run `yarn lint --fix` for auto-fixes
- Fix React hooks dependencies and unused vars manually
- **CI requires clean lint** - fix issues in your changes

### Builds
- **Windows builds need Windows OS** - will fail on Linux/macOS
- Builds may appear hung - they're working, **NEVER CANCEL**
- Set timeouts to 60+ minutes for build commands
- Port 8081 must be available for Metro bundler

### Tests
- Tests require Windows environment (RNW dependencies)
- Will fail on Linux due to native module imports
- Don't fix test infrastructure unless that's your task

## Timing Expectations

| Task | Duration | Notes |
|------|----------|-------|
| `yarn install` | ~60 seconds | Warnings expected, NEVER CANCEL |
| Metro start | 10-30 seconds | Works on all platforms |
| Windows build (first) | 5-30 minutes | Windows only, NEVER CANCEL |
| Windows build (incremental) | 2-10 minutes | After code changes |
| `yarn lint` | 10-20 seconds | - |
| CI builds | 5-15 minutes | Per arch/config |

**Critical**: React Native builds often appear to hang but are working. Wait for completion or explicit errors.