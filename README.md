# Build & Run
1. Install all dependencies per [RNW Dependencies](https://microsoft.github.io/react-native-windows/docs/rnw-dependencies)
1. `yarn`
1. `yarn windows`

# Design
The chat is driven by a list of `ChatElement` objects called `entries`. Each element contains the source `type` (`Human` or `Ai`), the `prompt` string that will drive the eventual content, a content type (`Text`, `Error`, or `Image`), the `text` that describes that content, and `id` for later lookup. Optionally there's also a JSX element `content` for use by chat scripts that may have custom controls. When the OpenAi query completes it updates the `ChatElement` with the resolved `text` and `contentType` values. This readonly list of entries is available in a `ChatHistoryContext`. This enables the OpenAi query to pull in all older `ChatElement` entries (determined by `id`) to pass to the chat completion call.

## Query Strategy
The OpenAi query is driven by a series of tasks.
1. First determine the intent of the prompt to see if it's a request for an image or not (INTENT)
2. If it is an image request, send a second prompt to build the DALL-E keyword query (KEYWORDS)
3. Fetch the final result
  - If it is an image request, send the keywords over for image generation (IMAGE-ANSWER)
  - If it isn't an image request, send the original prompt (plus chat history) over for chat completion (TEXT-ANSWER)

## App Services
The app's light/dark theming is handled by a `StylesContext` object that has theme-aware styles.
The app's settings are handled by a `SettingsContext` object, which has dialog UI for modifying those settings.

# Key Types
## App Fundamentals
| File | Type | Information |
| --- | --- | --- |
| App.tsx | `App` | Root of the app, publishes the `StylesContext` and `SettingsContext` |
| AppContent.tsx | `ChatSession` | Owns the `ChatElement` list, and handles any writes to that list |
| AppContent.tsx | `AutomatedChatSession` | Populates the `ChatSession` with either scripted responses or by creating components that query OpenAi |
| Chat.tsx | `Chat` | The scrolling list of chat entries. Publishes the `FeedbackContext`, `ChatHistoryContext`, and `ChatScrollContext` services. Hosts a `ChatEntry` for the user input. Hosts the dialogs of the app (`FeedbackPopup` and `SettingsPopups`).
| Chat.tsx | `ChatEntry` | Takes in the user's text input | 
| Feedback.tsx | `FeedbackPopup` | Popup for giving feedback on AI responses | 
| Settings.tsx | `SettingsPopup` | Popup that shows controls for modifying the `SettingsContext` | 
| Styles.tsx | `StylesContext` | StyleSheet that is light/dark mode aware | 

## AI Query & Response
| File | Type | Information |
| --- | --- | --- |
| AiFake.tsx | `AiSectionWithFakeResponse` | Component that simulates the visuals of a slow query, used for fake scripted responses | 
| AiQuery.tsx | `AiSectionWithQuery` | Primary driver of the OpenAi queries to turn a prompt into a text response | 
| AiResponse.tsx | `AiImageResponse` | Shows an image with controls for going back to a text query or getting variants | 
| AiResponse.tsx | `AiTextResponse` | Handles parsing text input into multiple sub-components (e.g. code blocks intermixed with plain text) | 
| AiResponse.tsx | `AiSection` | Component for displaying a received response, adding buttons for feedback | 
| AiResponse.tsx | `AiSectionContent` | Based on a `ChatElement`'s content type, shows the right child component | 
| ChatScript.tsx | `handleAIResponse` | Based on a hardcoded script, produces fake responses | 
| HumanQuery.tsx | `HumanSection` | Component for displaying a posted text query, adding buttons for edit and copy | 
| OpenAi.tsx | `CallOpenAi` | Handles posting a call to OpenAi and parsing the result | 

## Helper Controls
| File | Type | Information |
| --- | --- | --- |
| Controls.tsx | `HoverButton` | Button that changes style on mouse over |
| Controls.tsx | `Attribution` | Visual indicator for the provider of a skill |
| Controls.tsx | `ConsentSwitch` | Toggle for the user to enable/disable sharing information to a skill |
| Controls.tsx | `ImageSelection` | Image choice from a multi-image generation query |
| Controls.tsx | `Hyperlink` | Text that when clicked navigates to a url |
| CodeBlock.tsx | `CodeBlock` | Displays code with syntax highlighting and copy support |

# Dependencies
- Picker via [@react-native-clipboard/clipboard](https://github.com/react-native-clipboard/clipboard)
- Clipboard via [@react-native-picker/picker](https://github.com/react-native-picker/picker)
- Syntax Highlighting via [react-native-syntax-highlighter](https://github.com/conorhastings/react-native-syntax-highlighter)
- Dependency patching via [patch-package](https://github.com/ds300/patch-package)
