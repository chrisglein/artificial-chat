# Trial Mode

This document explains the trial mode feature that allows users to try the app without configuring their own OpenAI API key.

## Overview

Trial mode provides a limited number of free API calls (20 by default) using a fallback API key that is configured at build time. This allows new users to experience the app immediately without needing to set up their own API key first.

## How It Works

1. **Automatic Activation**: When no user API key is configured, the app automatically uses the fallback API key if available
2. **Usage Tracking**: Each successful API call is counted against the trial limit
3. **Storage**: Trial usage is tracked in the device's local storage (AsyncStorage)
4. **Status Display**: The Settings screen shows current trial status and remaining uses
5. **Graceful Expiration**: When trial uses are exhausted, helpful error messages guide users to get their own API key

## Features

### For Users
- **Instant Access**: Try the app immediately without configuration
- **Clear Status**: See remaining trial uses in Settings
- **Helpful Guidance**: Clear instructions on how to get an API key when trial expires

### For Developers
- **Build-time Configuration**: Fallback API key set during build process, not in source code
- **Environment Variable Support**: Can use `REACT_NATIVE_FALLBACK_API_KEY` for development
- **Zero Impact on Existing Users**: Users with API keys are unaffected

## Configuration

### Build-time Configuration

The fallback API key should be configured during the build process. In `src/TrialMode.tsx`, set the `BuildTimeFallbackKey` variable:

```typescript
const BuildTimeFallbackKey = 'your-fallback-api-key-here'; // Set during build
```

**Important**: Never commit the actual API key to the repository!

### Development/Testing

For development and testing, you can use an environment variable:

```bash
export REACT_NATIVE_FALLBACK_API_KEY="your-test-key"
npm run start
```

### Production Build

In your CI/CD pipeline, replace the placeholder with the actual fallback key:

```bash
# Example build script
sed -i 's/const BuildTimeFallbackKey = undefined/const BuildTimeFallbackKey = "'$FALLBACK_API_KEY'"/' src/TrialMode.tsx
npm run build
```

## Settings

The trial limit is set to 20 uses by default. You can modify this in `src/TrialMode.tsx`:

```typescript
const TRIAL_LIMIT = 20; // Change this value as needed
```

## Files Modified

- `src/TrialMode.tsx` - New module for trial mode functionality
- `src/OpenAI.tsx` - Modified to use fallback key and track usage
- `src/Settings.tsx` - Added trial status display
- `__tests__/TrialMode.test.tsx` - Tests for trial mode functionality

## Security Considerations

1. **Key Protection**: The fallback API key should have appropriate usage limits set in the OpenAI dashboard
2. **Rate Limiting**: Consider implementing additional rate limiting if needed
3. **Monitoring**: Monitor usage of the fallback key to detect abuse
4. **Rotation**: Regularly rotate the fallback API key

## User Experience

### First Launch
- Users can immediately start chatting without configuration
- Trial status is visible in Settings

### During Trial
- Each API call decrements the remaining count
- Status updates are shown in Settings
- No interruption to the user experience

### Trial Expiration
- Clear error message with link to OpenAI
- Settings show expired status
- User is guided to configure their own API key

## Error Messages

The app provides helpful error messages:

- **No API key, trial available**: Automatically uses trial mode
- **No API key, trial exhausted**: "Trial mode has expired. Please get your own API key from https://platform.openai.com/account/api-keys"
- **No fallback key configured**: "No API key provided. Please configure your OpenAI API key in Settings"

## Testing

Run the trial mode tests:

```bash
npm test -- __tests__/TrialMode.test.tsx
```

Tests cover:
- Trial limit configuration
- Usage calculation
- Availability checking
- Fallback key configuration