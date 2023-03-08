import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { HumanSection, AISectionWithQuery, AiSectionContent } from './Sections';
import { StylesContext } from './Styles';
import {
  FeedbackContext,
  FeedbackPopup,
} from './Feedback';
import { SettingsPopup } from './Settings';
import { HoverButton } from './Controls';

enum ChatSourceType {
  Human,
  Ai,
}
enum ChatContentType {
  Error,
  Text,
  Image,
}
type ChatElementType = {
  id: number;
  type: ChatSourceType;
  contentType: ChatContentType;
  prompt?: string;
  text?: string;
  content?: JSX.Element;
}
type ChatHistoryContextType = {
  entries: ChatElementType[];
}
const ChatHistoryContext = React.createContext<ChatHistoryContextType>({entries: []});


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
  entries: ChatElementType[];
  humanText? : string;
  onPrompt: (prompt: string) => void;
  onResponse: (response: string, contentType: ChatContentType, entryId: number) => void;
  regenerateResponse: () => void;
  clearConversation: () => void;
}>;
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
    // Wait for the new entry to be rendered
    setTimeout(() => {
      console.log(scrollViewRef);
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
                {entries.map((entry) => (
                  <View key={entry.id}>
                    {
                      entry.type === ChatSourceType.Human ? 
                        <HumanSection><Text>{entry.text}</Text></HumanSection> :
                        entry.content ?
                          entry.content :
                          entry.text ?
                            <AiSectionContent content={entry}/> : 
                            <AISectionWithQuery
                              id={entry.id}
                              prompt={entry.prompt ?? ""}
                              onResponse={(response, contentType) => onResponse(response, contentType, entry.id)}/>
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

export type { ChatElementType }
export { Chat, ChatScrollContext, ChatSourceType, ChatContentType, ChatHistoryContext };
