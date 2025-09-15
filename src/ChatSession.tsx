import React from 'react';
import {
  Chat,
  ChatContent,
  ChatHistoryContext,
  ChatSource,
} from './Chat';
import type { ChatElement } from './Chat';
import { SettingsContext } from './Settings';

// ChatSession drives a chat session by calling OpenAI for responses to user inputs.
type AutomatedChatSessionProps = {
  entries: ChatElement[];
  appendEntry: (entry: ChatElement | ChatElement[]) => void;
  clearConversation: () => void;
};
function AutomatedChatSession({entries, appendEntry, clearConversation}: AutomatedChatSessionProps): JSX.Element {
  const settings = React.useContext(SettingsContext);
  
  const onPrompt = (text: string) => {
    console.log(`Prompt: "${text}"`);
    
    appendEntry([
      {
        id: entries.length,
        type: ChatSource.Human,
        contentType: ChatContent.Text,
        responses: [text],
      },
      {
        id: entries.length + 1,
        contentType: ChatContent.Error,
        type: ChatSource.Ai,
        prompt: text,
      }
    ]);
  }

  return (
    <Chat
      entries={entries}
      onPrompt={onPrompt}
      clearConversation={clearConversation}/>
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

  const modifyEntry = React.useCallback((index: number, delta: any) => {
    let modifiedEntries = [...entries];
    if (index >= entries.length) {
      console.error(`Index ${index} is out of bounds`);
    } else {
      let entry = modifiedEntries[index];

      if (delta.hasOwnProperty('responses')) entry.responses = delta.responses;
      if (delta.hasOwnProperty('contentType')) entry.contentType = delta.contentType;
      if (delta.hasOwnProperty('prompt')) entry.prompt = delta.prompt;
      if (delta.hasOwnProperty('intent')) entry.intent = delta.intent;

      modifiedEntries[index] = entry;
      setEntries(modifiedEntries);
    }
  }, [entries]);

  const deleteEntry = React.useCallback((index: number) => {
    let modifiedEntries = [...entries];
    if (index >= entries.length) {
      console.error(`Index ${index} is out of bounds`);
    } else {
      modifiedEntries.splice(index, 1);
      setEntries(modifiedEntries);
    }
  }, [entries]);

  const clearConversation = () => setEntries([]);
  
  return (
    <ChatHistoryContext.Provider value={{
        entries: entries,
        modifyResponse: modifyEntry,
        deleteResponse: deleteEntry,
        add: element => {
          element.id = entries.length;
          appendEntry(element);
        }}}>
      <AutomatedChatSession
        entries={entries}
        appendEntry={appendEntry}
        clearConversation={clearConversation}/>
    </ChatHistoryContext.Provider>
  );
}

export { ChatSession };