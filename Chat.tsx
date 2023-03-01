import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { HumanSection } from './Sections';
import { StylesContext } from './Styles';
import {
  FeedbackContext,
  FeedbackPopup,
} from './Feedback';
import { SettingsPopup } from './Settings';
import { HoverButton } from './Controls';

type ChatScrollContextType = {
  scrollToEnd : () => void;
}
const ChatScrollContext = React.createContext<ChatScrollContextType>({scrollToEnd: () => {}});

type ChatEntryProps = PropsWithChildren<{
  defaultText?: string;
  submit: (text : string) => void;
  clearConversation: () => void;
}>;
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

type ChatProps = PropsWithChildren<{
  entries: JSX.Element[];
  humanText? : string;
  onPrompt: (prompt: string) => void;
  regenerateResponse: () => void;
  clearConversation: () => void;
}>;
function Chat({entries, humanText, onPrompt, regenerateResponse, clearConversation}: ChatProps): JSX.Element {
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
    // Wait for the new entry to be rendered
    setTimeout(() => {
      console.log(scrollViewRef);
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 100);
  }

  return (
    <FeedbackContext.Provider value={feedbackContext}>
      <ChatScrollContext.Provider value={{scrollToEnd: scrollToEnd}}>
        <View style={styles.appContent}>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            ref={scrollViewRef}
            style={{flexShrink: 1}}>
            <View
              style={{gap: 12}}>
              {entries.map((entry, entryIndex) => (
                <View key={entryIndex}>
                  {entry}
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
    </FeedbackContext.Provider>
  );
}

export { Chat, ChatScrollContext };
