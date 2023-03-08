import React from 'react';
import { Chat, ChatSource, ChatContent } from './Chat';
import type { ChatElement } from './Chat';
import { StylesContext } from './Styles';
import { SettingsContext } from './Settings';
import { handleAIResponse } from './ChatScript';

// Automated ChatSession drives a ChatSession in one of two ways:
// 1. If a script is specified, the user's inputs are fake responses are driven by that script.
// 2. If no script is specified, the user's inputs are used to drive the chat session by calling OpenAi for responses.
type AutomatedChatSessionProps = {
  entries: ChatElement[];
  appendEntry: (entry: ChatElement | ChatElement[]) => void;
  modifyEntryText: (index: number, text: string, contentType: ChatContent, prompt: string) => void;
  clearConversation: () => void;
};
function AutomatedChatSession({entries, appendEntry, modifyEntryText, clearConversation}: AutomatedChatSessionProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const settings = React.useContext(SettingsContext);

  const [chatScriptIndex, setChatScriptIndex] = React.useState(0);

  const advanceChatScript = (index: number, goToNext: () => void) => {
    let result : {
      aiResponse?: JSX.Element;
      humanResponse?: string;
    } = {
      aiResponse: undefined,
      humanResponse: undefined,
    }

    let response = handleAIResponse({
      scriptName: settings.scriptName,
      index: index,
      styles: styles,
      goToNext: goToNext,
    });
    let nextResponse = handleAIResponse({
      scriptName: settings.scriptName,
      index: index + 1,
      styles: styles,
      goToNext: goToNext,
    });

    // Give the AI's response
    result.aiResponse = response.aiResponse ? response.aiResponse() : undefined; 

    // Preopulate the text box with the human's next prompt
    result.humanResponse = nextResponse.prompt; 

    return result;
  }
  
  const onPrompt = (text: string, index: number) => {
    const followScript = settings.scriptName;

    if (followScript) {
      console.log(`Following script with prompt of '${text}', index is ${index}`);

      // Get the AI's response to the prompt
      let {aiResponse} = advanceChatScript(index, () => onPrompt("", index + 1));
      setChatScriptIndex(index + 1);
      console.log(aiResponse);

      // Append to the chat log
      // If the human has a prompt, add it to the chat
      if (text) {
        appendEntry([
          {
            type: ChatSource.Human,
            id: entries.length,
            contentType: ChatContent.Text,
            text: text,
          },
          {
            id: entries.length + 1,
            type: ChatSource.Ai,
            contentType: ChatContent.Text,
            text: text,
            content: aiResponse,
          }]);
      } else {
        appendEntry(
          {
            id: entries.length,
            type: ChatSource.Ai,
            contentType: ChatContent.Error,
            text: '',
            content: aiResponse,
          });
      }
    } else {
      console.log(`Prompt: "${text}"`);
      
      appendEntry([
        {
          id: entries.length,
          type: ChatSource.Human,
          contentType: ChatContent.Text,
          text: text,
        },
        {
          id: entries.length + 1,
          contentType: ChatContent.Error,
          type: ChatSource.Ai,
          prompt: text,
        }
      ]);
    }
  }

  // Anticipate the next human response
  let humanText = handleAIResponse({
    scriptName: settings.scriptName,
    index: chatScriptIndex,
    styles: styles,
    goToNext: () => {},
  }).prompt;

  return (
    <Chat
      entries={entries}
      humanText={humanText}
      onPrompt={(text) => onPrompt(text, chatScriptIndex)}
      onResponse={({prompt, response, contentType, entryId}) => modifyEntryText(entryId, response, contentType, prompt)}
      regenerateResponse={() => setChatScriptIndex(chatScriptIndex - 1)}
      clearConversation={() => {
        setChatScriptIndex(0);
        clearConversation();
      }}/>
  );
}

// Owns the list of chat entries
function ChatSession(): JSX.Element {
  const [entries, setEntries] = React.useState<ChatElement []>([]);

  const appendEntry = React.useCallback((newEntry: ChatElement | ChatElement[]) => {
    let modifiedEntries;
    if (Array.isArray(newEntry)) {
      modifiedEntries = [...entries, ...newEntry];
    } else {
      modifiedEntries = [...entries, newEntry];
    }
    setEntries(modifiedEntries);
  }, [entries]);

  const modifyEntryText = React.useCallback((index: number, text: string, contentType: ChatContent, prompt: string) => {
    let modifiedEntries = [...entries];
    if (index >= entries.length) {
      console.error(`Index ${index} is out of bounds`);
    } else {
      modifiedEntries[index].prompt = prompt;
      modifiedEntries[index].text = text;
      modifiedEntries[index].contentType = contentType;
      setEntries(modifiedEntries);
    }
  }, [entries]);

  const clearConversation = () => setEntries([]);
  
  return (
    <AutomatedChatSession
      entries={entries}
      appendEntry={appendEntry}
      modifyEntryText={modifyEntryText}
      clearConversation={clearConversation}/>
  );
}

export { ChatSession };