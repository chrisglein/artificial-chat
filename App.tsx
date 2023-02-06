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
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
      </Text>
      {children}
    </View>
  );
}

function HumanSection({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={[styles.sectionContainer, styles.humanSection]}>
      <Text style={styles.sectionTitle}>HUMAN</Text>
      {children}
    </View>
  );
}

function AISection({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={[styles.sectionContainer, styles.aiSection]}>
      <Text style={styles.sectionTitle}>AI</Text>
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
  const isDarkMode = useColorScheme() === 'dark';

  const [entries, setEntries] = React.useState([]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}>
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
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
          <>
            <HumanSection key={entryIndex}>
              <Text>{entry}</Text>
            </HumanSection> 
            <AISection>
              <Text>I cannot help you with "{entry}".</Text>
            </AISection>
          </>
        ))}
        <HumanSection>
          <ChatEntry
            submit={(newEntry) => setEntries([...entries, newEntry])}/>
        </HumanSection>
      </View>
    </ScrollView>
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
