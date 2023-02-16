import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Text,
} from 'react-native';
import {
  HumanSection,
  AISection,
  AISectionWithQuery,
} from './Sections';
import {
  Chat,
} from './Chat';
import {
  StylesContext,
} from './Styles';
import {
  handleAIResponse,
} from './ChatScript';

type AutomatedChatSessionProps = PropsWithChildren<{
  entries: JSX.Element[];
  appendEntry: (entry: JSX.Element | JSX.Element[]) => void;
}>;
function AutomatedChatSession({entries, appendEntry}: AutomatedChatSessionProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  // TODO: Figure out how to not duplicate this with array below
  const [humanText, setHumanText] = React.useState<string|undefined>("I want to design a board game about dinosaurs to play with my friends. Can you help?");

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

    let response = handleAIResponse(index, styles, goToNext);
    let nextResponse = handleAIResponse(index + 1, styles, goToNext);

    // Give the AI's response
    result.aiResponse = response.aiResponse ? response.aiResponse() : undefined; 

    // Preopulate the text box with the human's next prompt
    result.humanResponse = nextResponse.prompt; 

    return result;
  }
  
  let onPrompt = (text: string, index: number) => {
    const followScript = humanText !== undefined;

    if (followScript) {
      console.log(`Following script with prompt of '${text}', index is ${index}`);

      // Get the AI's response to the prompt, and predict the human's response to that
      let {aiResponse, humanResponse} = advanceChatScript(index, () => onPrompt(undefined, index + 1));
      setChatScriptIndex(index + 1);
      console.log(aiResponse);
      console.log(humanResponse);
  
      // If there wasn't a response, we hit the end of the script
      if (!aiResponse) {
        aiResponse =
          <AISection>
            <Text>You have reached the end of the script, and I cannot comment on "{text}"</Text>    
          </AISection>
      }

      // Append to the chat log
      // If the human has a prompt, add it to the chat
      if (text) {
        appendEntry([
          <HumanSection>
            <Text>{text}</Text>
          </HumanSection>,
          aiResponse]);
      } else {
        appendEntry(aiResponse);
      }

      // Prepopulate the human's next prompt
      setHumanText(humanResponse);
    } else {
      console.log(`Prompt: '${text}`);

      setHumanText(undefined);
      
      appendEntry([
        <HumanSection>
          <Text>{text}</Text>
        </HumanSection>,
        <AISectionWithQuery prompt={text}/>
      ]);
    }
  }

  return (
    <Chat
      entries={entries}
      humanText={humanText}
      onPrompt={(text) => onPrompt(text, chatScriptIndex)}
      regenerateResponse={() => setChatScriptIndex(0)}/>
  );
}

function ChatSession(): JSX.Element {
  const [entries, setEntries] = React.useState<JSX.Element []>([]);

  const appendEntry = React.useCallback((newEntry: JSX.Element | JSX.Element[]) => {
    if (Array.isArray(newEntry)) {
      setEntries([...entries, ...newEntry]);
    } else {
      setEntries([...entries, newEntry]);
    }
  }, [entries]);
  
  return (
    <AutomatedChatSession
      entries={entries}
      appendEntry={appendEntry}/>
  );
}

export { ChatSession };