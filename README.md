Artifical Chat is an app to explore the wonders of conversational AI using React Native for Windows to build the user experience. The goal is to handle not just plain text but rich markdown documents, code, and faciliate image generation as well.

![image](https://user-images.githubusercontent.com/26607885/233441056-39033d3c-3420-4c31-b7db-ca39944fc00e.png)

# Setup
1. Install all dependencies per [RNW Dependencies](https://microsoft.github.io/react-native-windows/docs/rnw-dependencies)
1. `yarn`

# Build & Run
1. `yarn windows`

# User Interface

### Chat entry
Type in natural language prompts to this field. Press Enter or the "Submit" button to get a response. The 💣 button clears the chat history.
![image](https://user-images.githubusercontent.com/26607885/223858100-82da9d59-3934-4497-81ff-8c3e0aaa6f82.png)

### Settings dialog
To get responses from OpenAI, you will need to provide an API Key in this dialog. It's available by pressing the ⚙️ button on the chat entry pane.

<img width="401" alt="image" src="https://user-images.githubusercontent.com/26607885/223858390-0bd5a4bd-2358-4d24-8d6d-ab8039b2f70f.png">

### Text Response
Your prompts will be responded to via [chat completion](https://platform.openai.com/docs/guides/chat).

<img width="720" alt="image" src="https://user-images.githubusercontent.com/26607885/223862976-ba9113e8-558a-49d1-9d28-cc4547154123.png">

### Image Response
If your prompt is determined to have primary intent to see an image, instead you will get a response from [image generation](https://platform.openai.com/docs/guides/images).

<img width="714" alt="image" src="https://user-images.githubusercontent.com/26607885/223865313-538544bf-ce76-4d38-a404-4aa456cec34b.png">

### Rich Code Blocks
In your text response, if there are markdown code blocks, those will get syntax highlighting and other code niceties.

<img width="716" alt="image" src="https://user-images.githubusercontent.com/26607885/223868129-d8aa12a9-c5b6-47a1-a5ae-7498a0860aef.png">

### Feedback dialog
There is a feedback dialog on each AI response. This is not yet implemented.

<img width="255" alt="image" src="https://user-images.githubusercontent.com/26607885/223870036-e8100f80-3360-4114-abb7-52e284039063.png">

### Regenerate
Pressing this button will result in a new OpenAI query for the previous response.

<img width="138" alt="image" src="https://user-images.githubusercontent.com/26607885/223875964-0a46490d-7d9a-4fe3-b57b-46ad7042e57d.png">


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
| About.tsx | `AboutPopup` | Popup for basic app information |
| App.tsx | `App` | Root of the app, publishes the `StylesContext` and `SettingsContext`. Hosts the `SettingsPopup` and `AboutPopup`. |
| ChatSession.tsx | `ChatSession` | Owns the `ChatElement` list, publishes the `ChatHistoryContext`, and handles any writes to that list |
| ChatSession.tsx | `AutomatedChatSession` | Populates the `ChatSession` with either scripted responses or by creating components that query OpenAi |
| Chat.tsx | `Chat` | The scrolling list of chat entries. Publishes the `FeedbackContext`, and `ChatScrollContext` services. Hosts a `ChatEntry` for the user input. Hosts the `FeedbackPopup`.
| Chat.tsx | `ChatEntry` | Takes in the user's text input | 
| Feedback.tsx | `FeedbackPopup` | Popup for giving feedback on AI responses | 
| Popups.tsx | `PopupsContext` | Coordinates popup visibility | 
| Settings.tsx | `SettingsPopup` | Popup that shows controls for modifying the `SettingsContext` and loads persistant values from app storage | 
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
- Clipboard via [@react-native-clipboard/clipboard](https://github.com/react-native-clipboard/clipboard)
- Syntax Highlighting via [react-native-syntax-highlighter](https://github.com/conorhastings/react-native-syntax-highlighter)
- Dependency patching via [patch-package](https://github.com/ds300/patch-package)
- Storage via [react-native-async-storage](https://github.com/react-native-async-storage/async-storage)
- Markdown rendering via [react-native-markdown-display-updated](https://github.com/willmac321/react-native-markdown-display)
- Dialogs via [react-native-content-dialog](https://github.com/chrisglein/react-native-content-dialog)
