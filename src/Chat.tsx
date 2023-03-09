import React from 'react';
import {
  Button,
  ScrollView,
  Text,
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
import { SettingsPopup } from './Settings';
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
  prompt?: string;
  text?: string;
  content?: JSX.Element;
}

// Context for read-only access to the chat log
const ChatHistoryContext = React.createContext<{
  entries: ChatElement[];
}>({entries: []});

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
        multiline={true}
        placeholder="Ask me anything"
        style={{flexGrow: 1, flexShrink: 1}}
        onChangeText={newValue => setValue(newValue)}
        submitKeyEvents={[{code: 'Enter', shiftKey: false}]}
        onSubmitEditing={submitValue}
        value={defaultText ?? value}/>
      <Button
        style={{flexShrink: 0}}
        title="Submit"
        onPress={submitValue}/>
      <Button
        style={{flexShrink: 0}}
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
  onResponse: ({prompt, response, contentType, entryId} : { prompt: string, response: string, contentType: ChatContent, entryId: number} ) => void;
  regenerateResponse: () => void;
  clearConversation: () => void;
};
function Chat({entries, humanText, onPrompt, onResponse, regenerateResponse, clearConversation}: ChatProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const [showFeedbackPopup, setShowFeedbackPopup] = React.useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = React.useState(false);
  const [feedbackIsPositive, setFeedbackIsPositive] = React.useState(false);
  const scrollViewRef : React.RefObject<ScrollView> = React.useRef(null);

  const feedbackContext = {
    showFeedback: (positive: boolean) => {
      setFeedbackIsPositive(positive);
      setShowFeedbackPopup(true);
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
      <ChatHistoryContext.Provider value={{entries: entries}}>
        <ChatScrollContext.Provider value={{scrollToEnd: scrollToEnd}}>
          <View style={styles.appContent}>
            <ScrollView
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
                        <HumanSection content={entry.text}/> :
                        entry.content ?
                          // The element may have provided its own UI
                          entry.content :
                          // Otherwise, either render the completed query or start a query to get the resolved text
                          entry.text ?
                            <AiSectionContent content={entry}/> : 
                            <AiSectionWithQuery
                              id={entry.id}
                              prompt={entry.prompt ?? ""}
                              onResponse={({prompt, response, contentType}) => onResponse({prompt: prompt, response: response, contentType: contentType, entryId: entry.id})}/>
                    }
                  </View>
                ))}
                {(entries.length > 0) &&
                  <View style={{alignSelf: 'center'}}>
                    <Button title="🔁 Regenerate response" onPress={() => regenerateResponse()}/>
                  </View>
                }
              </View>
            </ScrollView>
            <View
              style={{flexShrink: 0, marginBottom: 12}}>
              <HumanSection
                disableEdit={true}
                disableCopy={true}
                contentShownOnHover={
                  <HoverButton content="⚙️" onPress={() => setShowSettingsPopup(true)}/>
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
            { (showFeedbackPopup || showSettingsPopup) && <View style={styles.popupBackground}/> }
            <FeedbackPopup
              show={showFeedbackPopup}
              isPositive={feedbackIsPositive}
              close={() => setShowFeedbackPopup(false)}/>
            <SettingsPopup
              show={showSettingsPopup}
              close={() => setShowSettingsPopup(false)}/>
          </View>
        </ChatScrollContext.Provider>
      </ChatHistoryContext.Provider>
    </FeedbackContext.Provider>
  );
}

export type { ChatElement }
export { Chat, ChatScrollContext, ChatSource, ChatContent, ChatHistoryContext };
