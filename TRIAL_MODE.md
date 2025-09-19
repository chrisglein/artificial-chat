# Trial Mode Implementation

This implementation adds a trial mode feature that allows users to try the app without providing their own OpenAI API key.

## Features

- **Limited Free Usage**: Users get 20 free API calls before needing to add their own API key
- **Usage Tracking**: Trial usage is tracked using AsyncStorage and persisted across app sessions  
- **Trial Status Display**: Settings dialog shows remaining trial uses and trial expiration status
- **Improved Error Messages**: Better error messages with direct links to OpenAI when trial is exhausted or API errors occur
- **Graceful Fallback**: If trial API key is not available (default), the app behaves like before

## Implementation Details

### Trial API Key Mechanism

The trial API key is designed to be injected during the build process:

```tsx
// In TrialMode.tsx
const getTrialApiKey = (): string | undefined => {
  // This constant will be replaced during build
  const TRIAL_API_KEY = undefined; // BUILD_REPLACE_TRIAL_KEY
  return TRIAL_API_KEY;
};
```

For production builds, the build system should replace `undefined` with an actual API key. Until then, the app gracefully falls back to requiring user API keys.

### Usage Tracking

Trial usage is stored in AsyncStorage with the key `trialUsageCount`. Each API call increments this counter when using trial mode. The counter persists across app restarts.

### Error Handling

Enhanced error messages provide helpful guidance:
- No API key: Links to OpenAI signup page
- Trial exhausted: Prompts to add personal API key
- Quota/billing errors: Provides appropriate guidance based on trial vs personal key usage

### Settings UI

The settings dialog now shows:
- Trial status (active/expired) when no user API key is provided
- Remaining trial uses counter  
- Color-coded status messages (blue for active trial, orange for expired)

## Security Considerations

- No API keys are checked into the repository
- Trial API key is only injected during final build process  
- Usage tracking prevents abuse of trial quota
- Graceful degradation when trial key is not available

## Files Modified

- `src/TrialMode.tsx` - New module for trial mode logic
- `src/OpenAI.tsx` - Updated to use trial API key and improved error messages
- `src/Settings.tsx` - Enhanced UI to show trial status
- `__tests__/TrialMode.test.tsx` - Comprehensive test coverage