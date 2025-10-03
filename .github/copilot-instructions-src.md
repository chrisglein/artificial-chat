# Source Code (`src/`) - JavaScript/TypeScript

## Architecture Overview

This directory contains the React Native JavaScript/TypeScript code that defines the UI and business logic.

### Key Components

**App Foundation**
- `App.tsx` - Root component, provides StylesContext, SettingsContext, and PopupsContext
- `Styles.tsx` - Theme system with dark mode support
- `Popups.tsx` - Shared popup infrastructure

**Chat System**
- `ChatSession.tsx` - Manages chat history and ChatElement list (readonly context)
- `Chat.tsx` - Scrolling message list with FeedbackContext and ChatScrollContext
- `ChatSession.tsx` exports `AutomatedChatSession` for pre-populated demos

**AI Integration**
- `AiQuery.tsx` - Drives OpenAI queries, converts prompts to responses
- `AiResponse.tsx` - Renders AI responses with markdown/code blocks
- `HumanQuery.tsx` - Displays user prompts with edit/copy buttons
- `OpenAI.tsx` - Handles OpenAI API calls and response parsing

**UI Components**
- `Controls.tsx` - Reusable controls (Attribution, ConsentSwitch, FluentTextInput, FlyoutMenu, MarkdownWithRules, SwitchWithLabel, ImageSelection)
- `FluentControls.tsx` - Windows-styled controls
- `CodeBlock.tsx` - Syntax highlighting with copy support
- `Settings.tsx` - Settings dialog for API keys and preferences
- `Feedback.tsx` - Feedback collection for AI responses
- `About.tsx` - About dialog
- `WelcomeMessage.tsx` - First-run experience
- `Picker.tsx` - Custom picker control

**Features**
- `TrialMode.tsx` - Trial API key and usage tracking
- `Speech.tsx` - Text-to-speech integration

**Native Modules**
- `NativeVersionInfo.ts` - Turbo module for app/build version
- `NativeSpeech.ts` - Turbo module for Windows speech synthesis

## Making Changes

### State Management
- Settings flow through SettingsContext (API keys, models, preferences)
- Chat history is read-only via ChatHistoryContext
- Updates to chat happen through ChatSession component's state

### Adding New Features
1. If adding UI: Create component in Controls.tsx or new file
2. If adding settings: Update Settings.tsx and SettingsContext in App.tsx
3. If adding AI capability: Extend OpenAI.tsx handlers

### Common Patterns
- Use StylesContext for theming (never hardcode colors)
- Use React.useContext() to access app contexts
- Follow existing component structure in Controls.tsx
- Keep components focused on single responsibility

## Testing JavaScript Changes

```bash
# Start Metro bundler for fast iteration
npx react-native start

# Lint your changes
yarn lint

# Fix auto-fixable issues
yarn lint --fix
```

JavaScript changes can be developed on any platform. Windows is only required for building the native app.
