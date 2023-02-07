/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
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

const FeedbackContext = React.createContext({});

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
  title: string;
  disableEdit: boolean;
}>;

function HumanSection({children, title, disableEdit}: HumanSectionProps): JSX.Element {
  const [hovering, setHovering] = React.useState(false);

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

type AISectionProps = PropsWithChildren<{
  title: string;
}>;

function AISection({children, title}: AISectionProps): JSX.Element {
  const feedbackContext = React.useContext(FeedbackContext);

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
  source: string;
  submit: (string) => void;
}>;

function ChatEntry({source, submit}: ChatEntryProps): JSX.Element {
  const [value, onChangeText] = React.useState(null);

  const submitValue = () => {
    submit(value);
  };

  return (
    <View style={styles.horizontalContainer}>
      <TextInput
        multiline={true}
        placeholder="Ask me anything"
        style={{flexGrow: 1, marginRight: 12}}
        onChangeText={text => onChangeText(text)}
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
  defaultValue: boolean;
}>;

function ConsentSwitch({title, source, defaultValue}: ConsentSwitchProps): JSX.Element {
  const [value, onValueChange] = React.useState(defaultValue);

  return (
    <View style={[styles.horizontalContainer, {marginBottom: 8}]}>
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

function App(): JSX.Element {
  const [entries, setEntries] = React.useState([]);
  const [showFeedbackPopup, setShowFeedbackPopup] = React.useState(false);
  const [feedbackText, setFeedbackText] = React.useState(null);
  const [feedbackIsPositive, setFeedbackIsPositive] = React.useState(false);

  const context = {
    showFeedback: (positive: boolean) => {
      setFeedbackIsPositive(positive);
      setShowFeedbackPopup(true);
    }
  }

  return (
    <FeedbackContext.Provider value={context}>
      <View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic">
          <View
            style={{marginBottom: 12, opacity: showFeedbackPopup ? 0.3 : 1.0}}>
            <HumanSection>
              <Text>I want to design a board game about dinosaurs to play with my friends. Can you help?</Text>
            </HumanSection>
            <AISection>
              <Text>Sure! To do this best It would be helpful to add this information, do you consent?</Text>
              <ConsentSwitch
                title="Your BoardGameGeek.com play history"
                source="graph"
                defaultValue={true}/>
              <ConsentSwitch
                title="Your contact list of friends"
                source="facebook"/>
              <ConsentSwitch
                title="Your schedule for the next week"
                source="Google calendar"
                defaultValue={true}/>
              <ConsentSwitch
                title="Your bank account information for funding materials"
                source="Chase Bank"/>
              <Button title="Agree and Continue" onPress={() => {}}/>
            </AISection>
            <AISection>
              <Text>Thank you! Here is what I was able to come up with the information you provided to me:</Text>
              <Text>...</Text>
            </AISection>
            <HumanSection>
              <Text>I think we're ready for a box design. Can you provide one?</Text>
            </HumanSection>
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
            <HumanSection>
              <Text>I like the original best, let's stick with that. But I'd like my picture on the box, since I'm the designer, can we do that?</Text>
            </HumanSection>
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
            </AISection>
            <HumanSection>
              <Image style={styles.dalleImage} source={require('./assets/designerphoto.png')}/>
            </HumanSection>
            <AISection>
              <Text>Thanks! Here is the updated box design that incorporate your photo</Text>
              <Image style={styles.dalleImage} source={require('./assets/compositebox.png')}/>
              <Attribution source="Adobe Creative Cloud subscription"/>
            </AISection>
            {entries.map((entry, entryIndex) => (
              <View key={entryIndex}>
                <HumanSection>
                  <Text>{entry}</Text>
                </HumanSection> 
                <AISection>
                  <Text>I cannot help you with "{entry}".</Text>
                </AISection>
              </View>
            ))}
            <View style={{alignSelf: 'center', marginTop: 12}}>
              <Button title="🔁 Regenerate response" onPress={() => console.log("regenerate response")}/>
            </View>
            <HumanSection disableEdit={true}>
              <ChatEntry
                submit={(newEntry) => setEntries([...entries, newEntry])}/>
            </HumanSection>
          </View>
        </ScrollView>
        <Popup
          isOpen={showFeedbackPopup}
          isLightDismissEnabled={true}
          onDismiss={() => setShowFeedbackPopup(false)}>
          <View style={{backgroundColor: 'white', padding: 12, borderRadius: 8, minWidth: 300}}>
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

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 12,
    marginHorizontal: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  humanSection: {
    backgroundColor: 'lightblue',
    marginRight: 36,
  },
  aiSection: {
    backgroundColor: 'lightgray',
    marginLeft: 36,
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
  }
});

export default App;
