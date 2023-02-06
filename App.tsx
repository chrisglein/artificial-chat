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

type ConsentSwitchProps = PropsWithChildren<{
  title: string;
}>;

function ConsentSwitch({title}: ConsentSwitchProps): JSX.Element {
  return (
    <View style={styles.horizontalContainer}>
      <Switch></Switch>
      <Text>{title}</Text>
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
        <Button title="Choose this"/>
      </View>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

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
          <ConsentSwitch title="Your BoardGameGeek.com play history"/>
          <ConsentSwitch title="Your contact list of friends"/>
          <ConsentSwitch title="Your schedule for the next week"/>
          <ConsentSwitch title="Your bank account information for funding materials"/>
          <Button title="Agree and Continue" onPress={() => {}}/>
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
        </AISection>
        <HumanSection>
          <Text>I'd like my picture on the box, since I'm the designer, can we do that?</Text>
        </HumanSection>
        <AISection>
          <Text>Sure, here are some ways we can do that. Please choose one</Text>
          <View style={styles.horizontalContainer}>
            <View style={styles.inlineCard}>
              <Text>Access profile photos?</Text>
              <Button title="I consent" onPress={() => {}}/>
            </View>
            <View style={styles.inlineCard}>
              <Text>Take a picture</Text>
              <Button title="Snapshot" onPress={() => {}}/>
            </View>
          </View>
        </AISection>
        <AISection>
          <Text>Thanks! Here is the updated box design that incorporate your photo</Text>
          <View style={styles.horizontalContainer}>
            <Image style={styles.dalleImage} source={require('./assets/compositebox.png')}/>
          </View>
        </AISection>
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
    alignItems: 'center',
    gap: 12,
  },
  dalleImage: {
    width: 200,
    height: 200,
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
