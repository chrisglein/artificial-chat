import React from 'react';
import {ScrollView, TextInput, View} from 'react-native';
import {HumanSection} from './HumanQuery';
import {AiSectionContent} from './AiResponse';
import {AiSectionWithQuery} from './AiQuery';
import {StylesContext} from './Styles';
import {FeedbackContext, FeedbackPopup} from './Feedback';
import {PopupsContext} from './Popups';
import {SettingsContext} from './Settings';
import {ButtonV1 as Button} from '@fluentui/react-native';
import {Speak} from './Speech';

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
  responses?: string[];
  content?: JSX.Element;
};

// Context for read-only access to the chat log
const ChatHistoryContext = React.createContext<{
  entries: ChatElement[];
  modifyResponse: (id: number, delta?: any) => void;
  deleteResponse: (id: number) => void;
  add: (response: ChatElement) => void;
}>({
  entries: [],
  modifyResponse: () => {},
  deleteResponse: () => {},
  add: () => {},
});

// Context for being able to drive the chat scroller
const ChatScrollContext = React.createContext<{
  scrollToEnd: () => void;
}>({scrollToEnd: () => {}});

// Component for taking user input to drive the chat
type ChatEntryProps = {
  defaultText?: string;
  submit: (text: string) => void;
  clearConversation: () => void;
};
function ChatEntry({
  submit,
  defaultText,
  clearConversation,
}: ChatEntryProps): JSX.Element {
  const styles = React.useContext(StylesContext);

  // Allow a chat script to default populate the text box
  const [value, setValue] = React.useState(defaultText ?? '');

  const submitValue = () => {
    // If the user hits submit but the text is empty, don't carry that forward
    if (value !== '') {
      submit(value);
      // Reset to a blank prompt
      setValue('');
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
        value={defaultText ?? value}
      />
      <Button
        appearance="primary"
        accessibilityLabel="Submit prompt"
        onClick={submitValue}>
        Submit
      </Button>
      <Button
        accessibilityLabel="Clear conversation"
        icon={{
          fontSource: {
            fontFamily: 'Segoe MDL2 Assets',
            codepoint: 0xe74d,
            fontSize: 20,
          },
        }}
        iconOnly={true}
        tooltip="Clear conversation"
        onClick={clearConversation} />
    </View>
  );
}

// A scrolling list of ChatElements
type ChatProps = {
  entries: ChatElement[];
  humanText?: string;
  onPrompt: (prompt: string) => void;
  clearConversation: () => void;
};
function Chat({
  entries,
  humanText,
  onPrompt,
  clearConversation,
}: ChatProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const chatHistory = React.useContext(ChatHistoryContext);
  const popups = React.useContext(PopupsContext);
  const settings = React.useContext(SettingsContext);
  const [showFeedbackPopup, setShowFeedbackPopup] = React.useState(false);
  const [feedbackTargetResponse, setFeedbackTargetResponse] = React.useState<
    string | undefined
  >(undefined);
  const [feedbackIsPositive, setFeedbackIsPositive] = React.useState(false);
  const scrollViewRef: React.RefObject<ScrollView> = React.useRef(null);

  let showingAnyPopups =
    showFeedbackPopup || popups.showSettings || popups.showAbout;

  const feedbackContext = {
    showFeedback: (positive: boolean, response?: string) => {
      setFeedbackIsPositive(positive);
      setShowFeedbackPopup(true);
      setFeedbackTargetResponse(response);
    },
  }

  const scrollToEnd = () => {
    // Wait for the new entry to be rendered, then scroll it into view
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 100);
  };

  const onQueryResponse = (
    id: number,
    prompt: string,
    responses: string[],
    contentType: ChatContent,
  ) => {
    chatHistory.modifyResponse(id, {
      prompt: prompt,
      responses: responses,
      contentType: contentType});

    // As the responses come in, speak them aloud (if enabled)
    if (contentType == ChatContent.Text && settings.readToMeVoice) {
      Speak(responses[0]);
    }
  };

  return (
    <FeedbackContext.Provider value={feedbackContext}>
      <ChatScrollContext.Provider value={{scrollToEnd: scrollToEnd}}>
        <View style={styles.appContent}>
          <ScrollView
            accessibilityLabel="Chat log"
            ref={scrollViewRef}
            style={{flexShrink: 1}}>
            <View style={{gap: 12}}>
              {
                // For each item in the chat log, render the appropriate component
                entries.map(entry => (
                  <View key={entry.id}>
                    {entry.type === ChatSource.Human ?
                      // Human inputs are always plain text
                      <HumanSection
                        id={entry.id}
                        content={entry.responses ? entry.responses[0] : ''}/> :
                    entry.content ?
                      // The element may have provided its own UI
                      entry.content :
                    // Otherwise, either render the completed query or start a query to get the resolved text
                      entry.responses ?
                        <AiSectionContent id={entry.id} content={entry} />
                      :
                        <AiSectionWithQuery
                          id={entry.id}
                          prompt={entry.prompt ?? ''}
                          intent={entry.intent}
                          onResponse={({prompt, responses, contentType}) =>
                            onQueryResponse(
                              entry.id,
                              prompt,
                              responses,
                              contentType,
                            )
                          }
                        />
                      }
                  </View>
                ))
              }
              {entries.length > 0 &&
                entries[entries.length - 1].type === ChatSource.Ai && (
                  <View style={{alignSelf: 'center'}}>
                    <Button
                      accessibilityLabel="Regenerate response"
                      onClick={() => {
                        // Clear the response for the last entry
                        chatHistory.modifyResponse(entries.length - 1, {
                          responses: undefined,
                        });
                      }}>
                      🔁 Regenerate response
                    </Button>
                  </View>
                )}
            </View>
          </ScrollView>
          <View style={{flexShrink: 0, marginBottom: 12}}>
            <HumanSection
              id={undefined}
              disableCopy={true}
              moreMenu={[
                {
                  title: 'About',
                  icon: 0xe897,
                  onPress: () => popups.setShowAbout(true),
                },
                {
                  title: 'Settings',
                  icon: 0xe713,
                  onPress: () => popups.setShowSettings(true),
                }
              ]}>
              <ChatEntry
                defaultText={humanText}
                submit={newEntry => {
                  onPrompt(newEntry);
                  scrollToEnd();
                }}
                clearConversation={clearConversation}
              />
            </HumanSection>
          </View>
          {showingAnyPopups && <View style={styles.popupBackground} />}
          <FeedbackPopup
            show={showFeedbackPopup}
            isPositive={feedbackIsPositive}
            response={feedbackTargetResponse}
            close={() => setShowFeedbackPopup(false)}
          />
        </View>
      </ChatScrollContext.Provider>
    </FeedbackContext.Provider>
  );
}

export type {ChatElement};
export {Chat, ChatScrollContext, ChatSource, ChatContent, ChatHistoryContext};
