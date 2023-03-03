import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Text,
} from 'react-native';
import {
  HumanSection,
  AISectionWithQuery,
} from './Sections';
import { Chat } from './Chat';
import type { ChatElementType } from './Chat';
import { StylesContext } from './Styles';
import { SettingsContext } from './Settings';
import { handleAIResponse } from './ChatScript';

type AutomatedChatSessionProps = PropsWithChildren<{
  entries: ChatElementType[];
  appendEntry: (entry: ChatElementType | ChatElementType[]) => void;
  clearConversation: () => void;
}>;
function AutomatedChatSession({entries, appendEntry, clearConversation}: AutomatedChatSessionProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const settings = React.useContext(SettingsContext);

  const [chatScriptIndex, setChatScriptIndex] = React.useState(0);

  const advanceChatScript = (index: number, goToNext: () => void) => {
    type AutomatedChatResult = {
      aiResponse?: JSX.Element;
      humanResponse?: string;
    };
    let result : AutomatedChatResult = {
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
      let {aiResponse} = advanceChatScript(index, () => onPrompt(undefined, index + 1));
      setChatScriptIndex(index + 1);
      console.log(aiResponse);

      // Append to the chat log
      // If the human has a prompt, add it to the chat
      if (text) {
        appendEntry([
          {
            type: 'human',
            text: text,
          },
          {
            type: 'ai',
            text: text,
            content: aiResponse,
          }]);
      } else {
        appendEntry(
          {
            type: 'ai',
            text: text,
            content: aiResponse,
          });
      }
    } else {
      console.log(`Prompt: "${text}"`);
      
      appendEntry([
        {
          type: 'human',
          text: text,
          content:
            <HumanSection>
              <Text>{text}</Text>
            </HumanSection>
        },
        {
          type: 'ai',
          text: text, // TODO: This should be populated with the AI response, once we resolve it
          content: 
            <AISectionWithQuery prompt={text}/>
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
      regenerateResponse={() => setChatScriptIndex(chatScriptIndex - 1)}
      clearConversation={() => {
        setChatScriptIndex(0);
        clearConversation();
      }}/>
  );
}

function ChatSession(): JSX.Element {
  const [entries, setEntries] = React.useState<ChatElementType []>([]);

  const appendEntry = React.useCallback((newEntry: ChatElementType | ChatElementType[]) => {
    if (Array.isArray(newEntry)) {
      setEntries([...entries, ...newEntry]);
    } else {
      setEntries([...entries, newEntry]);
    }
  }, [entries]);

  const clearConversation = () => setEntries([]);
  
  return (
    <AutomatedChatSession
      entries={entries}
      appendEntry={appendEntry}
      clearConversation={clearConversation}/>
  );
}

export { ChatSession };