import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Appearance,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Popup,
} from 'react-native-windows';
import {
  Attribution,
  ConsentSwitch,
  ImageSelection,
  Hyperlink,
} from './Controls';
import {
  HumanSection,
  AISection,
  AISectionWithQuery,
} from './Sections';
import {
  StylesContext,
} from './Styles';
import {
  FeedbackContext,
} from './Feedback';
import {
  SettingsContext,
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
  const settingsContext = React.useContext(SettingsContext);
  const [showFeedbackPopup, setShowFeedbackPopup] = React.useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = React.useState(false);
  const [feedbackText, setFeedbackText] = React.useState("");
  const [feedbackIsPositive, setFeedbackIsPositive] = React.useState(false);
  const scrollViewRef : React.RefObject<ScrollView> = React.createRef();

  const context : FeedbackType = {
    showFeedback: (positive: boolean) => {
      setFeedbackIsPositive(positive);
      setShowFeedbackPopup(true);
    }
  }

  return (
    <FeedbackContext.Provider value={context}>
      <View style={styles.appContent}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          ref={scrollViewRef}>
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
            <HumanSection
              hoverButtonText="⚙️"
              hoverButtonOnPress={() => setShowSettingsPopup(true)}>
              <ChatEntry
                defaultText={humanText}
                submit={(newEntry) => {
                  onPrompt(newEntry);
                  // Wait for the new entry to be rendered
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd();
                  }, 200);
                }}/>
            </HumanSection>
          </View>
        </ScrollView>
        <Popup
          isOpen={showFeedbackPopup}
          isLightDismissEnabled={true}
          onDismiss={() => setShowFeedbackPopup(false)}>
          <View style={styles.feedbackDialog}>
            <View style={{flexDirection: 'row', marginBottom: 4}}>
              <View style={{backgroundColor: feedbackIsPositive ? 'green' : 'red', borderRadius: 4, marginRight: 4}}>
                <Text>{feedbackIsPositive ? "👍" : "👎"}</Text>
              </View>
              <Text>Provide additional feedback</Text>
            </View>
            <TextInput
              multiline={true}
              placeholder="What would the ideal answer have been?"
              style={{flexGrow: 1, minHeight: 32}}
              onChangeText={value => setFeedbackText(value)}
              value={feedbackText}/>
              {!feedbackIsPositive && (
                <View>
                  <View style={styles.horizontalContainer}>
                    <Switch/>
                    <Text>This is harmful / unsafe</Text>
                  </View>
                  <View style={styles.horizontalContainer}>
                    <Switch/>
                    <Text>This isn't true</Text>
                  </View>
                  <View style={styles.horizontalContainer}>
                    <Switch/>
                    <Text>This isn't helpful</Text>
                  </View>
                </View>
              )}
            <View style={{marginTop: 12, alignSelf: 'flex-end'}}>
              <Button
                title="Submit feedback"
                onPress={() => {
                  console.log(feedbackIsPositive ? "like" : "dislike");
                  console.log(feedbackText);
                  setShowFeedbackPopup(false);
                }}/>
            </View>
          </View>
        </Popup>
        <Popup
          isOpen={showSettingsPopup}
          isLightDismissEnabled={true}
          onDismiss={() => setShowSettingsPopup(false)}>
          <View style={styles.feedbackDialog}>
            <View style={{flexDirection: 'row', marginBottom: 4}}>
              <View style={{backgroundColor: 'gray', borderRadius: 4, marginRight: 4}}>
                <Text>⚙️</Text>
              </View>
              <Text>OpenAI Settings</Text>
            </View>
            <TextInput
              secureTextEntry={true}
              placeholder="Your API key"
              style={{flexGrow: 1, minHeight: 32}}
              onChangeText={value => settingsContext.apiKey = value}
              value={settingsContext.apiKey}/>
            <Hyperlink url="https://platform.openai.com/account/api-keys"/>
            <View style={{marginTop: 12, alignSelf: 'flex-end'}}>
              <Button
                title="OK"
                onPress={() => {
                  setShowSettingsPopup(false);
                }}/>
            </View>
          </View>
        </Popup>
      </View>
    </FeedbackContext.Provider>
  );
}

type AutomatedChatSessionProps = PropsWithChildren<{
  entries: JSX.Element[];
  appendEntry: (entry: JSX.Element | JSX.Element[]) => void;
}>;
function AutomatedChatSession({entries, appendEntry}: AutomatedChatSessionProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  // TODO: Figure out how to not duplicate this with array below
  const [humanText, setHumanText] = React.useState<string|undefined>("I want to design a board game about dinosaurs to play with my friends. Can you help?");

  const [chatScriptIndex, setChatScriptIndex] = React.useState(0);

  type AutomatedChatResult = {
    prompt?: string;
    aiResponse?: () => JSX.Element;
  };

  const advanceChatScript = (index: number, goToNext: () => void) => {
    const handleAIResponse = (index: number) => {
      switch (index) {
        case 0: return {
          prompt: "I want to design a board game about dinosaurs to play with my friends. Can you help?",
          aiResponse: () => {
            console.log("running code now...");
            return (
            <AISection>
              <Text>Sure! To do this best It would be helpful to add this information, do you consent?</Text>
              <ConsentSwitch
                title="Your BoardGameGeek.com play history"
                details="This will help me understand what games you like to play and what you like about them."
                source="BoardGameGeek.com"
                defaultValue={true}/>
              <ConsentSwitch
                title="Your contact list of friends"
                details="This will help me understand who you play games with and what games they like to play."
                source="facebook"/>
              <ConsentSwitch
                title="Your schedule for the next week"
                details="Knowing your availability and the deadline for completing the game will help me suggest an appropriate pace and scope for the project, and ensure that the game can be completed within the desired time frame."
                source="Google calendar"
                defaultValue={true}/>
              <ConsentSwitch
                title="Your bank account information for funding materials"
                details="This will help me understand how much money you have available to spend on materials for the game."
                source="Chase Bank"/>
              <Button title="Agree and Continue" onPress={() => goToNext()}/>
            </AISection>
          )}
        }
        case 1: return {
          prompt: "I agree",
          aiResponse: () =>
            <AISection>
              <Text>Thank you! Here is what I was able to come up with the information you provided to me:</Text>
              <Text>...</Text>
            </AISection>,
        }
        case 2: return {
          prompt: "I think we're ready for a box design. Can you provide one?",
          aiResponse: () =>
            <AISection>
              <Text>Here are some box designs</Text>
              <View style={styles.horizontalContainer}>
                <ImageSelection image={require('./assets/dinobox1.png')}/>
                <ImageSelection image={require('./assets/dinobox2.png')}/>
                <ImageSelection image={require('./assets/dinobox3.png')}/>
                <ImageSelection image={require('./assets/dinobox4.png')}/>
              </View>
              <Attribution source="DALL-E, 14 monthly credits remaining"/>
            </AISection>
        }
        case 3: return {
          prompt: "Variations of 3",
          aiResponse: () =>
            <AISection>
              <Text>Here are variations on the image you selected</Text>
              <View style={styles.horizontalContainer}>
                <ImageSelection image={require('./assets/dinobox3_variation1.png')}/>
                <ImageSelection image={require('./assets/dinobox3_variation2.png')}/>
                <ImageSelection image={require('./assets/dinobox3_variation3.png')}/>
                <ImageSelection image={require('./assets/dinobox3_variation4.png')}/>
              </View>
              <Attribution source="DALL-E, 13 monthly credits remaining"/>
            </AISection>
        }
        case 4: return {
          prompt: "I like the original best, let's stick with that. But I'd like my picture on the box, since I'm the designer, can we do that?",
          aiResponse: () =>
            <AISection>
              <Text>Sure, here are some ways we can do that. Please choose one</Text>
              <View style={styles.horizontalContainer}>
                <View style={styles.inlineCard}>
                  <Button title="Access profile photos" onPress={() => goToNext()}/>
                  <Attribution source="OneDrive"/>
                </View>
                <View style={styles.inlineCard}>
                  <Button title="Generate a placeholder image" onPress={() => goToNext()}/>
                  <Attribution source="DALL-E"/>
                </View>
                <View style={styles.inlineCard}>
                  <Button title="Take a picture now" onPress={() => goToNext()}/>
                </View>
                <View style={styles.inlineCard}>
                  <Button title="Upload your own" onPress={() => goToNext()}/>
                </View>
              </View>
            </AISection>
        }
        case 5: return {
          prompt: "I have provided an image!",
          aiResponse: () =>
            <AISection>
              <Text>Thanks! Here is the updated box design that incorporate your photo</Text>
              <Image style={styles.dalleImage} source={require('./assets/compositebox.png')}/>
              <Attribution source="Adobe Creative Cloud subscription"/>
            </AISection>
        }
        default: return {
          prompt: undefined,
          aiResponse: undefined,
        }
      }
    }

    type AutomatedChatResult2 = {
      aiResponse?: JSX.Element;
      humanResponse?: string;
    };
    
    let result : AutomatedChatResult2 = {
      aiResponse: undefined,
      humanResponse: undefined,
    }

    let response = handleAIResponse(index);
    let nextResponse = handleAIResponse(index + 1);

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

function App(): JSX.Element {
  const [currentTheme, setCurrentTheme] = React.useState(Appearance.getColorScheme());
  const isDarkMode = currentTheme === 'dark';

  const onAppThemeChanged = () => {
    setCurrentTheme(Appearance.getColorScheme());
  };

  React.useEffect(() => {
    Appearance.addChangeListener(onAppThemeChanged);
  });

  const styles : StylesType = StyleSheet.create({
    appContent: {
      backgroundColor: isDarkMode ? 'black' : 'white',
      paddingVertical: 12,
    },
    sectionContainer: {
      marginHorizontal: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    humanSection: {
      backgroundColor: isDarkMode ? '#333355' : 'lightblue',
      marginRight: 64,
    },
    aiSection: {
      backgroundColor: isDarkMode ? '#444444' : 'lightgray',
      marginLeft: 64,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '600',
    },
    highlight: {
      fontWeight: '700',
    },
    horizontalContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 12,
    },
    dalleImage: {
      width: 150,
      height: 150,
    },
    inlineCard: {
      borderColor: 'gray',
      borderWidth: 2,
      borderRadius: 8,
      padding: 8,
    },
    feedbackDialog: {
      backgroundColor: isDarkMode ? 'black' : 'white',
      padding: 12,
      borderRadius: 8,
      minWidth: 300
    }
  });

  return (
    <StylesContext.Provider value={styles}>
      <SettingsContext.Provider value={{}}>
        <View>
          <ChatSession/>
        </View>
      </SettingsContext.Provider>
    </StylesContext.Provider>
  );
}

export default App;
