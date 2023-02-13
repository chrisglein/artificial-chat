import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Appearance,
  Button,
  Image,
  Pressable,
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

type FeedbackType = {
  showFeedback : (positive: boolean) => void;
}

type StylesType = {
  appContent: any;
  sectionContainer: any;
  humanSection: any;
  aiSection: any;
  sectionTitle: any;
  sectionDescription: any;
  highlight: any;
  horizontalContainer: any;
  dalleImage: any;
  inlineCard: any;
  feedbackDialog: any;
}

const FeedbackContext = React.createContext<FeedbackType>({showFeedback: () => {}});
const StylesContext = React.createContext<StylesType>({});

type FeedbackButtonProps = PropsWithChildren<{
  content: string;
  onPress: () => void;
}>;

function FeedbackButton({content, onPress}: FeedbackButtonProps): JSX.Element {
  const [hovering, setHovering] = React.useState(false);

  const backgroundBaseStyle = {padding: 2, borderRadius: 8, borderWidth: 1, borderColor: 'transparent'};
  const backgroundPressedStyle = {borderColor: 'white', backgroundColor: 'black'};
  const backgroundHoverStyle = {borderColor: 'white', backgroundColor: 'gray'};
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}>
      {({pressed}) => (
        <View style={[backgroundBaseStyle, pressed ? backgroundPressedStyle : hovering ? backgroundHoverStyle : null]}>
          <Text >{content}</Text>
        </View>        
      )}
    </Pressable>
  );
}

type HumanSectionProps = PropsWithChildren<{
  disableEdit?: boolean;
}>;

function HumanSection({children, disableEdit}: HumanSectionProps): JSX.Element {
  const [hovering, setHovering] = React.useState(false);
  const styles = React.useContext(StylesContext);

  return (
    <Pressable
      style={[styles.sectionContainer, styles.humanSection]}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}>
      <View style={{flexDirection: 'row', minHeight: 26}}>
        <Text style={[styles.sectionTitle, {flexGrow: 1}]}>HUMAN</Text>
        {!disableEdit && hovering && <FeedbackButton content="📝" onPress={() => console.log("edit")}/>}
      </View>
      {children}
    </Pressable>
  );
}

function AISection({children}: PropsWithChildren): JSX.Element {
  const feedbackContext = React.useContext(FeedbackContext);
  const styles = React.useContext(StylesContext);

  const showFeedbackPopup = (positive: boolean) => {
    if (feedbackContext) {
      feedbackContext.showFeedback(positive);
    }
  }

  return (
    <View style={[styles.sectionContainer, styles.aiSection]}>
      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.sectionTitle, {flexGrow: 1}]}>AI</Text>
        <FeedbackButton content="👍" onPress={() => { showFeedbackPopup(true); }}/>
        <FeedbackButton content="👎" onPress={() => { showFeedbackPopup(false); }}/>
      </View>
      {children}
    </View>
  );
}

type AttributionProps = PropsWithChildren<{
  source: string;
}>;

function Attribution({source}: AttributionProps): JSX.Element {
  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={{fontSize: 12, fontStyle: 'italic'}}>source:</Text>
      <Text style={{fontSize: 12, marginHorizontal: 4}}>{source}</Text>
      <Text style={{fontSize: 12}}>🔍</Text>
    </View>
  );
}

type ChatEntryProps = PropsWithChildren<{
  submit: (text : string) => void;
}>;

function ChatEntry({submit}: ChatEntryProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const [value, setValue] = React.useState("");

  const submitValue = () => {
    submit(value);
  };

  return (
    <View style={styles.horizontalContainer}>
      <TextInput
        multiline={true}
        placeholder="Ask me anything"
        style={{flexGrow: 1, marginRight: 12}}
        onChangeText={newValue => setValue(newValue)}
        value={value}/>
      <Button
        title="Submit"
        onPress={submitValue}/>
    </View>
  );
}

type ConsentSwitchProps = PropsWithChildren<{
  title: string;
  source: string;
  details: string;
  defaultValue?: boolean;
}>;

function ConsentSwitch({title, source, defaultValue, details}: ConsentSwitchProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const [value, onValueChange] = React.useState(defaultValue);

  return (
    <View
      style={[styles.horizontalContainer, {marginBottom: 8}]}
      tooltip={details}>
      <Switch value={value} onValueChange={onValueChange}/>
      <View>
        <Text>{title}</Text>
        <Attribution source={source}/>
      </View>
    </View>
  );
}

type ImageSelectionProps = PropsWithChildren<{
  image: ImageSourcePropType;
}>;

function ImageSelection({image}: ImageSelectionProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  return (
    <View style={{marginRight: 12}}>
      <Image style={styles.dalleImage} source={image}/>
      <View style={[styles.horizontalContainer, {marginTop: 4, justifyContent: 'space-between'}]}>
        <Button title="Variations"/>
        <Button title="Select"/>
      </View>
    </View>
  );
}

type ChatProps = PropsWithChildren<{
  entries: Element[];
  setEntries: (entries: Element[]) => void;
}>;

function Chat({entries, setEntries}: ChatProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const [showFeedbackPopup, setShowFeedbackPopup] = React.useState(false);
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
            style={{marginBottom: 12, opacity: showFeedbackPopup ? 0.3 : 1.0}}>
            {entries.map((entry, entryIndex) => (
              <View key={entryIndex}>
                {entry}
              </View>
            ))}
            <View style={{alignSelf: 'center', marginTop: 12}}>
              <Button title="🔁 Regenerate response" onPress={() => console.log("regenerate response")}/>
            </View>
            <HumanSection disableEdit={true}>
              <ChatEntry
                submit={(newEntry) => {
                  let humanPrompt = 
                    <HumanSection>
                      <Text>{newEntry}</Text>
                    </HumanSection>
                  let aiResponse = 
                    <AISection>
                      <Text>I cannot help you with "{newEntry}".</Text>
                    </AISection>
                  setEntries([...entries, humanPrompt, aiResponse]);
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
      </View>
    </FeedbackContext.Provider>
  );
}

function ChatSession(): JSX.Element {
  const styles = React.useContext(StylesContext);
  
  const [entries, setEntries] = React.useState<Element []>([
    <HumanSection>
      <Text>I want to design a board game about dinosaurs to play with my friends. Can you help?</Text>
    </HumanSection>,
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
      <Button title="Agree and Continue" onPress={() => {}}/>
    </AISection>,
    <AISection>
      <Text>Thank you! Here is what I was able to come up with the information you provided to me:</Text>
      <Text>...</Text>
    </AISection>,
    <HumanSection>
      <Text>I think we're ready for a box design. Can you provide one?</Text>
    </HumanSection>,
    <AISection>
      <Text>Here are some box designs</Text>
      <View style={styles.horizontalContainer}>
        <ImageSelection image={require('./assets/dinobox1.png')}/>
        <ImageSelection image={require('./assets/dinobox2.png')}/>
        <ImageSelection image={require('./assets/dinobox3.png')}/>
        <ImageSelection image={require('./assets/dinobox4.png')}/>
      </View>
      <Attribution source="DALL-E, 14 monthly credits remaining"/>
    </AISection>,
    <AISection>
      <Text>Here are variations on the image you selected</Text>
      <View style={styles.horizontalContainer}>
        <ImageSelection image={require('./assets/dinobox3_variation1.png')}/>
        <ImageSelection image={require('./assets/dinobox3_variation2.png')}/>
        <ImageSelection image={require('./assets/dinobox3_variation3.png')}/>
        <ImageSelection image={require('./assets/dinobox3_variation4.png')}/>
      </View>
      <Attribution source="DALL-E, 13 monthly credits remaining"/>
    </AISection>,
    <HumanSection>
      <Text>I like the original best, let's stick with that. But I'd like my picture on the box, since I'm the designer, can we do that?</Text>
    </HumanSection>,
    <AISection>
      <Text>Sure, here are some ways we can do that. Please choose one</Text>
      <View style={styles.horizontalContainer}>
        <View style={styles.inlineCard}>
          <Button title="Access profile photos" onPress={() => {}}/>
          <Attribution source="OneDrive"/>
        </View>
        <View style={styles.inlineCard}>
          <Button title="Generate a placeholder image" onPress={() => {}}/>
          <Attribution source="DALL-E"/>
        </View>
        <View style={styles.inlineCard}>
          <Button title="Take a picture now" onPress={() => {}}/>
        </View>
        <View style={styles.inlineCard}>
          <Button title="Upload your own" onPress={() => {}}/>
        </View>
      </View>
    </AISection>,
    <HumanSection>
      <Image style={styles.dalleImage} source={require('./assets/designerphoto.png')}/>
    </HumanSection>,
    <AISection>
      <Text>Thanks! Here is the updated box design that incorporate your photo</Text>
      <Image style={styles.dalleImage} source={require('./assets/compositebox.png')}/>
      <Attribution source="Adobe Creative Cloud subscription"/>
    </AISection>
  ]);

  return (
    <Chat
      entries={entries}
      setEntries={setEntries}/>
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
    },
    sectionContainer: {
      marginTop: 12,
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
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
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
      marginRight: 12,
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
      <View>
        <ChatSession/>
      </View>
    </StylesContext.Provider>
  );
}

export default App;
