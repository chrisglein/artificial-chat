# Artificial Chat - React Native for Windows

Artificial Chat is a React Native for Windows application that explores conversational AI with rich markdown, code highlighting, and image generation capabilities.

**CRITICAL: Always reference these instructions first and fallback to search or additional commands only when you encounter unexpected information that does not match the information provided here.**

## Working Effectively

### Prerequisites and Environment Setup
- **Node.js 18+** is required. Verify with `node --version`
- **Yarn package manager** is required. Verify with `yarn --version`
- **Windows environment required for full builds** - this app targets React Native for Windows (RNW)
- **Linux/macOS can be used for JavaScript development** but cannot build or run the Windows application

### Bootstrap and Dependencies
- `yarn install` - Install all dependencies. Takes ~60 seconds. NEVER CANCEL.
- `patch-package` runs automatically post-install to apply required patches

### JavaScript Development (Cross-platform)
- `npx react-native start` - Start Metro bundler for JavaScript development
- Metro bundler runs on port 8081 by default
- JavaScript bundler works on all platforms for development

### Windows Build (Windows environment only)
- **CRITICAL**: Windows builds require Windows OS with MSBuild and Visual Studio components
- Install Windows dependencies: Run `node_modules/react-native-windows/Scripts/rnw-dependencies.ps1` from elevated PowerShell
- More info: https://microsoft.github.io/react-native-windows/docs/rnw-dependencies
- `yarn windows` - Build and run Windows application. Takes 5-15 minutes on first build. NEVER CANCEL. Set timeout to 30+ minutes.
- `yarn windows --release` - Release build (takes longer)

### Testing and Quality
- `yarn test` - Run Jest tests. **NOTE**: Tests will fail on Linux due to React Native Windows module imports. Tests are designed to run in Windows environment with proper RNW dependencies
- `yarn lint` - Run ESLint to check code quality
- `yarn lint --fix` - Auto-fix some linting issues
- **CRITICAL**: Only fix linting issues on lines you are modifying. Do not make linting changes to unrelated files or lines unless the PR is specifically for linting fixes.

## Validation and Manual Testing

### NEVER CANCEL Build Operations
- **Windows builds take 5-15 minutes minimum, up to 30+ minutes on slow machines**
- **Metro bundler startup takes 10-30 seconds**
- **Dependency installation takes ~60 seconds**
- **Always set timeouts to 60+ minutes for build commands**
- **NEVER stop or cancel long-running builds - they may appear to hang but are working**

### Required Manual Validation After Changes
- **ALWAYS run Metro bundler** (`npx react-native start`) to verify JavaScript compiles
- **ALWAYS run lint check** (`yarn lint`) before completing work - CI will fail on lint errors
- **On Windows environments**: Build and run the app (`yarn windows`) to verify UI changes
- **Test core functionality**: Open settings dialog, enter text in chat field, verify UI rendering

### Known Working Commands and Timing
```bash
# Dependencies (60 seconds, warnings expected)
yarn install

# JavaScript bundler (10-30 seconds startup)
npx react-native start

# Windows build (5-30 minutes, Windows only)
yarn windows

# Linting (10-20 seconds)
yarn lint
```

## Project Structure and Key Locations

### Source Code (`src/`)
- `App.tsx` - Root component, provides StylesContext and SettingsContext
- `Chat.tsx` - Main chat interface with scrolling messages
- `ChatSession.tsx` - Manages chat history and state
- `AiQuery.tsx` - Handles OpenAI API integration
- `AiResponse.tsx` - Renders AI responses with markdown and code
- `Settings.tsx` - Settings dialog for API keys and preferences
- `Styles.tsx` - Theme and styling system

### Tests (`__tests__/`)
- `App.test.tsx` - Basic component rendering test

### Configuration
- `package.json` - Dependencies and scripts
- `metro.config.js` - React Native bundler configuration
- `babel.config.js` - JavaScript transpilation settings
- `.eslintrc.js` - Linting rules
- `windows/` - Windows-specific native code and project files

### Key Dependencies
- React Native for Windows 0.74.x
- OpenAI integration for chat and image generation
- Syntax highlighting and markdown rendering

## Common Issues and Solutions

### Linting Errors
- **Multiple linting issues may exist in the codebase** 
- Many are style issues (inline styles, missing semicolons)
- **Always run `yarn lint` before completing work** - CI requires clean lint
- **CRITICAL**: Only fix linting issues on lines you are modifying for your changes
- **Exception**: PRs specifically dedicated to linting fixes can touch multiple unrelated files
- Some issues require manual fixes (React hooks dependencies, unused variables)

### Test Failures on Linux
- Jest configuration has issues with React Native Windows imports on non-Windows platforms
- Tests are designed to run in Windows environment
- **Do not attempt to fix test configuration unless specifically working on test infrastructure**

### Build Failures
- **Windows builds require Windows OS** - will fail with "Couldn't determine Windows app config" on other platforms
- **Missing MSBuild/Visual Studio** - Run RNW dependencies script
- **Port conflicts** - Metro bundler uses port 8081, ensure it's available

### Dependency Warnings
- Patch-package warnings about version mismatches may occur and are generally expected
- Most dependency warnings should be addressed in recent commits

## Development Workflow Best Practices

### Before Making Changes
- Start Metro bundler: `npx react-native start`
- Verify current state compiles without errors
- Check linting baseline: `yarn lint`

### During Development
- Keep Metro bundler running for fast JavaScript iteration
- **For UI changes**: Use React Native debugger or log statements
- **For state changes**: Test settings persistence and chat history

### Before Completing Work
- **ALWAYS run `yarn lint`** - fix critical errors
- **ALWAYS verify Metro bundler compiles cleanly**
- **On Windows**: Build and manually test application
- **Test key scenarios**: Settings dialog, chat input, response rendering

### Common File Change Patterns
- **When modifying OpenAI integration**: Check `AiQuery.tsx` and `OpenAI.tsx`
- **When changing UI styling**: Update `Styles.tsx` and check theme consistency
- **When adding new components**: Follow existing patterns in `Controls.tsx`
- **When modifying chat flow**: Update `ChatSession.tsx` and test state management

## Performance and Timing Expectations

### First-time Setup (Windows)
1. Install RNW dependencies: 5-10 minutes
2. `yarn install`: ~60 seconds  
3. First Windows build: 5-30 minutes
4. Total first-time setup: 15-45 minutes

### Regular Development
1. Metro bundler start: 10-30 seconds
2. JavaScript changes: Near-instant hot reload
3. Windows rebuilds: 2-10 minutes for incremental changes
4. Linting: 10-20 seconds

### CI Build Times
- Windows CI builds take 5-15 minutes per architecture/configuration
- Runs on Windows 2022 with x86/x64 and debug/release matrix

**REMEMBER: NEVER CANCEL long-running operations. React Native builds often appear to hang but are working. Always wait for completion or explicit error messages.**