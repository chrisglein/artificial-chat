import React from 'react';
import {
  Button,
  Image,
  Text,
  View,
} from 'react-native';
import {
  Attribution,
  ConsentSwitch,
  ImageSelection,
} from './Controls';
import {
  AISection,
} from './Sections';

const ChatScriptNames = [
  "Dinosaurs",
  "Developer",
  "AdaptiveCard"
]

const runDinosaurScript = (index: number, styles, goToNext) => {
  switch (index) {
    case 0: return {
      prompt: "I want to design a board game about dinosaurs to play with my friends. Can you help?",
      aiResponse: () => {
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

const runDeveloperScript = (index: number, styles, goToNext) => {
  switch (index) {
    case 0: return {
      prompt: "I am a developer!",
      aiResponse: () => {
        return (
        <AISection>
          <Text>Oh really?</Text>
        </AISection>
      )}
    }
    case 1: return {
      prompt: "Yep, it's true.",
      aiResponse: () =>
        <AISection>
          <Text>Thanks for sharing!</Text>
        </AISection>,
    }
    default: return {
      prompt: undefined,
      aiResponse: undefined,
    }
  }
}

function AdaptiveCard(props) {
  return (
    <View>
      <Button title="Placeholder"/>
      <Attribution source="AdaptiveCard"/>
    </View>
  )
}

const runAdaptiveCardScript = (index: number, styles, goToNext) => {
  switch (index) {
    case 0:
      return {
        prompt: 'I want to generate an Adaptive Card. Can you help?',
        aiResponse: () => {
          console.log('running code now...');
          return (
            <AISection>
              <Text>
                Sure! What content would you like included in your Adaptive
                Card?
              </Text>
            </AISection>
          );
        },
      };
    case 1:
      return {
        prompt:
          "I would like a textblock with the text 'This is an Adaptive Card', an image of the Adaptive Card logo, and the card to have a light blue background.",
        aiResponse: () => (
          <AISection>
            <Text>
              Thank you! Here is what I was able to come up with the information
              you provided to me:
            </Text>
            <AdaptiveCard
              payload={{
                type: 'AdaptiveCard',
                version: '1.0',
                body: [
                  {
                    type: 'Image',
                    url: 'http://adaptivecards.io/content/adaptive-card-50.png',
                  },
                  {
                    type: 'TextBlock',
                    text: 'This is an Adaptive Card',
                  },
                ],
              }}
              hostConfig={{fontFamily: 'Segoe UI, Helvetica Neue, sans-serif'}}
              themeConfig={{}}
              onExecuteAction={() => {
                console.log('execute');
              }}
              onParseError={() => {
                console.log('parse error');
              }}
              containerStyle={{
                width: 300,
                height: 300,
                flexGrow: 1,
                backgroundColor: 'lightblue',
                borderRadius: 3,
              }}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'space-evenly',
              }}
              contentHeight={300}
            />
          </AISection>
        ),
      };
    case 2:
      return {
        prompt: 'Could I see the JSON used to generate this Adaptive Card?',
        aiResponse: () => (
          <AISection>
            <Text>Certainly! Here is the JSON:</Text>
            <Text>{`{
                type: 'AdaptiveCard',
                version: '1.0',
                body: [
                  {
                    type: 'Image',
                    url: 'http://adaptivecards.io/content/adaptive-card-50.png',
                  },
                  {
                    type: 'TextBlock',
                    text: 'This is an Adaptive Card',
                  },
                ],
              }`}</Text>
          </AISection>
        ),
      };
    case 3:
      return {
        prompt:
          "I'd like the Adaptive Card to be 200 x 200 pixels. Could you make that change?",
        aiResponse: () => (
          <AISection>
            <Text>Yes! Here is your new Adaptive Card: </Text>
            <AdaptiveCard
              payload={{
                type: 'AdaptiveCard',
                version: '1.0',
                body: [
                  {
                    type: 'Image',
                    url: 'http://adaptivecards.io/content/adaptive-card-50.png',
                  },
                  {
                    type: 'TextBlock',
                    text: 'This is an Adaptive Card',
                  },
                ],
              }}
              hostConfig={{fontFamily: 'Segoe UI, Helvetica Neue, sans-serif'}}
              themeConfig={{}}
              onExecuteAction={() => {
                console.log('execute');
              }}
              onParseError={() => {
                console.log('parse error');
              }}
              containerStyle={{
                width: 200,
                height: 200,
                flexGrow: 1,
                backgroundColor: 'lightblue',
                borderRadius: 3,
              }}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'space-evenly',
              }}
              contentHeight={200}
            />
          </AISection>
        ),
      }
    default: return {
      prompt: undefined,
      aiResponse: undefined,
    }
  }
}

type HandleAIResponseType = {
  index: number,
  styles: any,
  goToNext: () => void,
  scriptName: string | undefined,
}
const handleAIResponse = ({index, styles, goToNext, scriptName} : HandleAIResponseType) => {
  switch (scriptName) {
    case ChatScriptNames[0]:
      return runDinosaurScript(index, styles, goToNext);
    case ChatScriptNames[1]:
      return runDeveloperScript(index, styles, goToNext);
    case ChatScriptNames[2]:
      return runAdaptiveCardScript(index, styles, goToNext);
    default:
      return {
        prompt: undefined,
        aiResponse: undefined,
      }
  }
}

export { handleAIResponse, ChatScriptNames }