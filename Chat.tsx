import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import {
  HumanSection,
} from './Sections';
import {
  StylesContext,
} from './Styles';
import {
  FeedbackContext,
  FeedbackPopup,
} from './Feedback';
import {
  SettingsPopup,
} from './Settings';

type ChatEntryProps = PropsWithChildren<{
  defaultText?: string;
  submit: (text : string) => void;
}>;
function ChatEntry({submit, defaultText}: ChatEntryProps): JSX.Element {
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
        value={defaultText ?? value}/>
      <Button
        style={{flexShrink: 0}}
        title="Submit"
        onPress={submitValue}/>
    </View>
  );
}

type ChatProps = PropsWithChildren<{
  entries: JSX.Element[];
  humanText? : string;
  onPrompt: (prompt: string) => void;
  regenerateResponse: () => void;
}>;
function Chat({entries, humanText, onPrompt, regenerateResponse}: ChatProps): JSX.Element {
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
      <View style={styles.appContent}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          ref={scrollViewRef}
          style={{flexShrink: 1}}>
          <View
            style={{
              gap: 12,
              opacity: showFeedbackPopup ? 0.3 : 1.0}}>
            {entries.map((entry, entryIndex) => (
              <View key={entryIndex}>
                {entry}
              </View>
            ))}
            <View style={{alignSelf: 'center'}}>
              <Button title="🔁 Regenerate response" onPress={() => regenerateResponse()}/>
            </View>
          </View>
        </ScrollView>
        <HumanSection
          hoverButtonText="⚙️"
          hoverButtonOnPress={() => setShowSettingsPopup(true)}
          style={{flexShrink: 0}}>
          <ChatEntry
            defaultText={humanText}
            submit={(newEntry) => {
              onPrompt(newEntry);
              scrollToEnd();
            }}/>
        </HumanSection>
        <FeedbackPopup
          show={showFeedbackPopup}
          isPositive={feedbackIsPositive}
          close={() => setShowFeedbackPopup(false)}/>
        <SettingsPopup
          show={showSettingsPopup}
          close={() => setShowSettingsPopup(false)}/>
      </View>
    </FeedbackContext.Provider>
  );
}

export { Chat };
