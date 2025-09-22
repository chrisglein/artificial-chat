import React from 'react';
import {Chat, ChatContent, ChatHistoryContext, ChatSource} from './Chat';
import type {ChatElement} from './Chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

const chatLogKey = 'chatLog';

// Chat entries that are saved between app sessions (excludes content JSX.Element)
type SerializableChatElement = Omit<ChatElement, 'content'>;

// Save chat log to app storage
const SaveChatData = async (entries: ChatElement[]) => {
  console.debug('Saving chat data...');
  try {
    // Filter out the content field which contains JSX and can't be serialized
    const serializableEntries: SerializableChatElement[] = entries.map(entry => {
      const {content, ...serializableEntry} = entry;
      return serializableEntry;
    });
    const valueAsString = JSON.stringify(serializableEntries);
    await AsyncStorage.setItem(chatLogKey, valueAsString);
    console.debug('Done saving chat data');
  } catch (e) {
    console.error('Error saving chat data:', e);
  }
};

// Load chat log from app storage
const LoadChatData = async (): Promise<ChatElement[]> => {
  console.debug('Loading chat data...');
  try {
    const valueAsString = await AsyncStorage.getItem(chatLogKey);
    if (valueAsString != null) {
      const entries: SerializableChatElement[] = JSON.parse(valueAsString);
      // Convert back to ChatElement (content field will be undefined, which is fine)
      return entries.map(entry => ({
        ...entry,
        content: undefined, // Will be regenerated when needed
      }));
    }
  } catch (e) {
    console.error('Error loading chat data:', e);
  }
  return [];
};

// ChatSession drives the chat session by creating components that query OpenAI for responses
type AutomatedChatSessionProps = {
  entries: ChatElement[];
  appendEntry: (entry: ChatElement | ChatElement[]) => void;
  clearConversation: () => void;
};
function AutomatedChatSession({
  entries,
  appendEntry,
  clearConversation,
}: AutomatedChatSessionProps): JSX.Element {
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
      },
    ]);
  };

  return (
    <Chat
      entries={entries}
      humanText={undefined}
      onPrompt={text => onPrompt(text)}
      clearConversation={() => {
        clearConversation();
      }}
    />
  );
}

// Owns the list of chat entries
function ChatSession(): JSX.Element {
  const [entries, setEntries] = React.useState<ChatElement[]>([]);

  // Load chat history on component mount
  React.useEffect(() => {
    const loadChatHistory = async () => {
      const loadedEntries = await LoadChatData();
      setEntries(loadedEntries);
    };
    loadChatHistory();
  }, []);

  // Save chat history whenever entries change
  React.useEffect(() => {
    // Only save if we have entries to avoid overwriting with empty array on initial load
    if (entries.length > 0) {
      SaveChatData(entries);
    }
  }, [entries]);

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

      if (delta.hasOwnProperty('responses')) {entry.responses = delta.responses;}
      if (delta.hasOwnProperty('contentType')) {entry.contentType = delta.contentType;}
      if (delta.hasOwnProperty('prompt')) {entry.prompt = delta.prompt;}
      if (delta.hasOwnProperty('intent')) {entry.intent = delta.intent;}

        modifiedEntries[index] = entry;
        setEntries(modifiedEntries);
      }
    },
    [entries],
  );

  const deleteEntry = React.useCallback(
    (index: number) => {
      let modifiedEntries = [...entries];
      if (index >= entries.length) {
        console.error(`Index ${index} is out of bounds`);
      } else {
        modifiedEntries.splice(index, 1);
        setEntries(modifiedEntries);
      }
    },
    [entries],
  );

  const clearConversation = async () => {
    setEntries([]);
    // Clear the stored chat data as well
    try {
      await AsyncStorage.removeItem(chatLogKey);
      console.debug('Cleared stored chat data');
    } catch (e) {
      console.error('Error clearing chat data:', e);
    }
  };

  return (
    <ChatHistoryContext.Provider
      value={{
        entries: entries,
        modifyResponse: modifyEntry,
        deleteResponse: deleteEntry,
        add: element => {
          element.id = entries.length;
          appendEntry(element);
        },
      }}>
      <AutomatedChatSession
        entries={entries}
        appendEntry={appendEntry}
        clearConversation={clearConversation}
      />
    </ChatHistoryContext.Provider>
  );
}

export { ChatSession };
