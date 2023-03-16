import React from 'react';
import {
  Button,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { HumanSection } from './HumanQuery';
import { AiSectionContent } from './AiResponse';
import { AiSectionWithQuery } from './AiQuery';
import { StylesContext } from './Styles';
import {
  FeedbackContext,
  FeedbackPopup,
} from './Feedback';
import {
  SettingsContext,
} from './Settings';
import { AboutPopup } from './About';
import { HoverButton } from './Controls';

enum ChatSource {
  Human,
  Ai,
}
enum ChatContent {
  Error,
  Text,
  Image,
}
type ChatElement = {
  id: number;
  type: ChatSource;
  contentType: ChatContent;
  intent?: string;
  prompt?: string;
  text?: string;
  content?: JSX.Element;
}

// Context for read-only access to the chat log
const ChatHistoryContext = React.createContext<{
  entries: ChatElement[];
  modifyResponse: (id: number, delta?: any) => void;
  deleteResponse: (id: number) => void;
}>({
  entries: [],
  modifyResponse: () => {},
  deleteResponse: () => {},
});

// Context for being able to drive the chat scroller
const ChatScrollContext = React.createContext<{
  scrollToEnd : () => void;
}>({scrollToEnd: () => {}});

// Component for taking user input to drive the chat
type ChatEntryProps = {
  defaultText?: string;
  submit: (text : string) => void;
  clearConversation: () => void;
};
function ChatEntry({submit, defaultText, clearConversation}: ChatEntryProps): JSX.Element {
  const styles = React.useContext(StylesContext);

  // Allow a chat script to default populate the text box
  const [value, setValue] = React.useState(defaultText ?? "");

  const submitValue = () => {
    // If the user hits submit but the text is empty, don't carry that forward
    if (value !== "") {
      submit(value);
      // Reset to a blank prompt
      setValue("");
    }
  };

  return (
    <View style={styles.horizontalContainer}>
      <TextInput
        accessibilityLabel="Prompt input"
        multiline={true}
        placeholder="Ask me anything"
        style={{flexGrow: 1, flexShrink: 1}}
        onChangeText={newValue => setValue(newValue)}
        submitKeyEvents={[{code: 'Enter', shiftKey: false}]}
        onSubmitEditing={submitValue}
        value={defaultText ?? value}/>
      <Button
        accessibilityLabel='Submit prompt'
        title="Submit"
        onPress={submitValue}/>
      <Button
        accessibilityLabel='Clear conversation'
        title="💣"
        onPress={clearConversation}/>
    </View>
  );
}

// A scrolling list of ChatElements
type ChatProps = {
  entries: ChatElement[];
  humanText? : string;
  onPrompt: (prompt: string) => void;
  clearConversation: () => void;
};
function Chat({entries, humanText, onPrompt, clearConversation}: ChatProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const chatHistory = React.useContext(ChatHistoryContext);
  const settings = React.useContext(SettingsContext);
  const [showFeedbackPopup, setShowFeedbackPopup] = React.useState(false);
  const [feedbackTargetResponse, setFeedbackTargetResponse] = React.useState<string | undefined>(undefined);
  const [showAboutPopup, setShowAboutPopup] = React.useState(false);
  const [feedbackIsPositive, setFeedbackIsPositive] = React.useState(false);
  const scrollViewRef : React.RefObject<ScrollView> = React.useRef(null);

  let showingAnyPopups = (showFeedbackPopup || settings.showPopup || showAboutPopup);

  const feedbackContext = {
    showFeedback: (positive: boolean, response?: string) => {
      setFeedbackIsPositive(positive);
      setShowFeedbackPopup(true);
      setFeedbackTargetResponse(response);
    }
  }

  const scrollToEnd = () => {
    // Wait for the new entry to be rendered, then scroll it into view
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 100);
  }

  return (
    <FeedbackContext.Provider value={feedbackContext}>
      <ChatScrollContext.Provider value={{scrollToEnd: scrollToEnd}}>
        <View style={styles.appContent}>
          <ScrollView
            accessibilityLabel="Chat log"
            contentInsetAdjustmentBehavior="automatic"
            ref={scrollViewRef}
            style={{flexShrink: 1}}>
            <View
              style={{gap: 12}}>
              {// For each item in the chat log, render the appropriate component
              entries.map((entry) => (
                <View key={entry.id}>
                  {
                    entry.type === ChatSource.Human ? 
                      // Human inputs are always plain text
                      <HumanSection
                        id={entry.id}
                        content={entry.text}/> :
                      entry.content ?
                        // The element may have provided its own UI
                        entry.content :
                        // Otherwise, either render the completed query or start a query to get the resolved text
                        entry.text ?
                          <AiSectionContent
                            id={entry.id}
                            content={entry}/> : 
                          <AiSectionWithQuery
                            id={entry.id}
                            prompt={entry.prompt ?? ""}
                            intent={entry.intent}
                            onResponse={({prompt, response, contentType}) => 
                              chatHistory.modifyResponse(entry.id, {prompt: prompt, text: response, contentType: contentType})}/>
                  }
                </View>
              ))}
              {(entries.length > 0 &&  entries[entries.length - 1].type === ChatSource.Ai) &&
                <View style={{alignSelf: 'center'}}>
                  <Button
                    accessibilityLabel="Regenerate response"
                    title="🔁 Regenerate response"
                    onPress={() => {
                      // Clear the response for the last entry
                      chatHistory.modifyResponse(entries.length - 1, {text: undefined});
                    }}/>
                </View>
              }
            </View>
          </ScrollView>
          <View
            style={{flexShrink: 0, marginBottom: 12}}>
            <HumanSection
              id={undefined}
              disableCopy={true}
              contentShownOnHover={
                <>
                  <HoverButton content="❔" tooltip="About" onPress={() => setShowAboutPopup(true)}/>
                  <HoverButton content="⚙️" tooltip="Settings" onPress={() => settings.setShowPopup(true)}/>
                </>
              }>
              <ChatEntry
                defaultText={humanText}
                submit={(newEntry) => {
                  onPrompt(newEntry);
                  scrollToEnd();
                }}
                clearConversation={clearConversation}/>
            </HumanSection>
          </View>
          { showingAnyPopups && <View style={styles.popupBackground}/> }
          <FeedbackPopup
            show={showFeedbackPopup}
            isPositive={feedbackIsPositive}
            response={feedbackTargetResponse}
            close={() => setShowFeedbackPopup(false)}/>
          <AboutPopup
            show={showAboutPopup}
            close={() => setShowAboutPopup(false)}/>
        </View>
      </ChatScrollContext.Provider>
    </FeedbackContext.Provider>
  );
}

export type { ChatElement }
export { Chat, ChatScrollContext, ChatSource, ChatContent, ChatHistoryContext };
