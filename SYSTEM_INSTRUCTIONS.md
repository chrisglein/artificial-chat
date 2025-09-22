# System Instructions Feature

This document demonstrates the new system instructions customization feature that replaces the hardcoded AI behavior.

## Default Instructions (Updated)

The default system instructions have been improved from:
```
The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. If the response involves code, use markdown format for that with ```(language) blocks.
```

To:
```
The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. You may use markdown syntax in the response as appropriate.
```

## How to Customize System Instructions

1. Open the app settings (click the settings icon)
2. In the "Chat" section, find the "System Instructions" field
3. Modify the text to define how you want the AI to behave
4. Click "OK" to save the changes

## Example Use Cases

### Emoji Responses (from the original issue)
Set the system instructions to:
```
Your job is to evaluate the predominant emotion of each prompt. Respond with one and only one emoji and no additional text.
```

### Code Expert
```
You are a senior software engineer. Provide concise, accurate code solutions and explanations. Always include error handling and best practices.
```

### Creative Writer
```
You are a creative writing assistant. Help with storytelling, character development, and creative ideas. Use vivid descriptions and engaging language.
```

## Technical Implementation

- System instructions are stored in `SettingsContext` and persisted via `AsyncStorage`
- All chat completion API calls use the custom instructions instead of hardcoded ones
- The multiline text input in settings allows for complex instruction sets
- Changes take effect immediately for new conversations

## Files Modified

- `src/Settings.tsx` - Added UI and persistence logic
- `src/App.tsx` - Added systemInstructions to settings context
- `src/AiQuery.tsx` - Uses custom instructions from settings
- `src/OpenAI.tsx` - Updated default fallback instructions