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
import { AISection } from './Sections';
import { StylesContext } from './Styles';

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

function CodeBlock({content, language} : {content: string, language: string}) {
  const styles = React.useContext(StylesContext);
  return (
    <View>
      <View style={[styles.codeBlockTitle, {flexDirection: 'row', borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingHorizontal: 12}]}>
        <Text style={[styles.codeBlockTitleText, {flexGrow: 1, alignSelf: "center"}]}>{language}</Text>
        <Button title="📋 Copy Code"/>
      </View>
      <View style={[styles.codeBlockContent, {borderBottomLeftRadius: 8, borderBottomRightRadius: 8}]}>
        <Text style={{fontFamily: "Courier New", margin: 10}}>{content}</Text>
      </View>
    </View>
  )
}

const runDeveloperScript = (index: number, styles, goToNext) => {
  switch (index) {
    case 0: return {
      prompt: "I'd like to run a white elephant gift exchange. Are you familiar with the rules?",
      aiResponse: () => {
        return (
        <AISection>
          <Text>Yes, I am familiar with the rules of a white elephant gift exchange! A white elephant gift exchange is a fun game typically played during holiday parties or other social gatherings. The basic rules of a white elephant gift exchange are as follows:</Text>
          <Text>1. Each participant brings a wrapped gift of a certain value, usually set by the host or organizer of the game.</Text>
          <Text>2. All the wrapped gifts are placed in a central location.</Text>
          <Text>3. Participants draw numbers to determine the order in which they will choose a gift.</Text>
          <Text>4. The first participant selects a wrapped gift from the central location and opens it.</Text>
          <Text>5. The second participant can either choose to "steal" the gift that the first participant opened or choose a new wrapped gift from the central location.</Text>
          <Text>6. If a gift is stolen, the person who had their gift stolen then gets to choose a new gift from the central location or steal another gift.</Text>
          <Text>7. The game continues in this way until all participants have had a turn and all gifts have been opened.</Text>
          <Text>There are many variations on these rules, and some hosts may choose to add their own twists or rules to the game. It's important to establish any variations or rules before the game begins to avoid confusion or disagreements among participants.</Text>
        </AISection>
      )}
    }
    case 1: return {
      prompt: "I need to run this white elephant party remotely over a video call (e.g. Teams or Zoom). What are the challenges you foresee in the participants aren't able to be physically located together?",
      aiResponse: () =>
        <AISection>
          <Text>Running a white elephant gift exchange remotely over a video call can present some challenges. Here are a few that you may want to consider:</Text>
          <Text>1. Gift delivery: In a traditional white elephant gift exchange, participants bring their gifts to the party and place them in a central location. With a remote party, participants will need to send their gifts to each other in advance. This can be a logistical challenge, especially if participants are located far apart or in different countries.</Text>
          <Text>2. Timing: It may be difficult to coordinate the timing of the gift exchange so that everyone can participate in real-time. Time zones and scheduling conflicts can make it challenging to find a time that works for everyone.</Text>
          <Text>3. Stealing gifts: The "stealing" aspect of a white elephant gift exchange can be tricky to manage remotely. It may be difficult to keep track of who has what gift and to ensure that everyone has an equal opportunity to steal or choose a new gift.</Text>
          <Text>4. Limited visibility: With a remote party, participants may not be able to see all of the gifts at once, which can make it harder to decide which one to choose. Additionally, participants may not be able to see each other's reactions or engage in the same level of banter and camaraderie that they would during an in-person party.</Text>
          <Text>To address these challenges, you may want to consider setting up a clear system for gift delivery, scheduling the party at a time that works for as many participants as possible, and using a virtual whiteboard or other tool to keep track of who has which gift. You may also want to establish clear rules for how stealing will work and consider using a random number generator or other tool to determine the order in which participants will choose their gifts. Finally, make sure to set the right expectations and encourage participants to have fun and be flexible, even if the party doesn't go exactly as planned.</Text>
        </AISection>,
    }
    case 2: return {
      prompt: "Instead of using a virtual whiteboard, I'd like to create a tool to help manage the gift exchange. Can you help me with that and what are my best options for authoring this app? I have a Windows PC.",
      aiResponse: () =>
        <AISection>
          <Text>Sure, I can definitely help you with that! Depending on your level of programming experience and the complexity of the tool you want to create, there are several different options for creating an app to help manage your remote white elephant gift exchange.</Text>
          <Text>Here are a few suggestions for different levels of programming experience:</Text>
          <Text>1. No programming experience: If you have no programming experience, one option could be to use a tool like Google Forms or Microsoft Forms to create a survey that participants can use to choose their gifts. You can set up the survey to randomly assign participants a number or a turn in the gift exchange, and then have them enter their gift choice as well as their address for gift delivery. You can then use the survey results to track who has chosen which gift and ensure that everyone receives their gift in a timely manner.</Text>
          <Text>2. Some programming experience: If you have some programming experience, you could create a simple web application using a framework like Flask or Django. The application could allow participants to log in and choose their gift from a list of available options. You could also use the application to randomly assign turn order and track who has chosen which gift. To create a web application, you will need to know HTML, CSS, and either Python (for Flask) or Python and JavaScript (for Django).</Text>
          <Text>3. Advanced programming experience: If you have advanced programming experience, you could create a more complex web application using a modern JavaScript framework like React or Angular. This would allow you to create a more interactive and dynamic user interface, with features like real-time updates, chat functionality, and more. To create a web application using React or Angular, you will need to be proficient in JavaScript and HTML/CSS.</Text>
          <Text>For Windows PC, you can use a variety of code editors or integrated development environments (IDEs) to create your app. Some popular options include Visual Studio Code, PyCharm, and Sublime Text. You will also need to choose a database to store your application data; for a simple application, you could use a lightweight database like SQLite, while for a more complex application, you may want to consider a more robust database like MySQL or PostgreSQL.</Text>
          <Text>Regardless of which option you choose, I would recommend starting with a clear set of requirements for your app and sketching out some basic wireframes to help you visualize how the user interface will work. This will help you stay focused and ensure that you're creating a tool that will be both useful and enjoyable for your participants.</Text>
        </AISection>,
    }
    case 3: return {
      prompt: `Here are my requirements:
      - There is one organizer for the gift exchange that runs the app. In advance of the meeting, all participants provide an image to represent their gift in its wrapped state, and an image to represent their gift in its unwrapped state (usually a photo of the gift).
      - The app manages a queue of whose turn it is to open/steal the next gift
      - The app shows a grid of images for all the wrapped and unwrapped gifts, with an indication on the unwrapped gifts of who currently has possession of it as well as the number of times it has been stolen
      - If an item has been stolen 3 times, display a big red X over the image to show that it can not be stolen again
      - There will need to be a way to change the name of who possesses each item after it is stolen
      - Since the images may not be self-explanatory enough, provide a way for each to be given a text label, typed in during the presentation
      
      I consider myself to have advanced programming experience. Let's make this a React app. Please create the JavaScript for this app.`,
      aiResponse: () =>
        <AISection>
          <Text>Great! Here is an example of how you could create a React app to meet your requirements:</Text>
          <Text>First, you would need to set up your development environment and create a new React app using a tool like Create React App. Once you have your app set up, you could create a component to represent each gift:</Text>
          <CodeBlock language="jsx" content={`import React, { useState } from 'react';

const Gift = ({ wrappedImage, unwrappedImage, label, owner, stolenCount, onSteal, onChangeOwner }) => {
  const [isWrapped, setIsWrapped] = useState(true);

  const handleClick = () => {
    if (isWrapped) {
      setIsWrapped(false);
    } else {
      onSteal();
    }
  };

  const handleOwnerChange = (event) => {
    onChangeOwner(event.target.value);
  };

  return (
    <div className="gift">
      <div className="gift-image" onClick={handleClick}>
        {isWrapped ? <img src={wrappedImage} alt="Wrapped gift" /> : <img src={unwrappedImage} alt="Unwrapped gift" />}
        {!isWrapped && <div className="gift-stolen-count">{stolenCount}</div>}
      </div>
      <div className="gift-label">{label}</div>
      <div className="gift-owner">
        <input type="text" value={owner} onChange={handleOwnerChange} />
      </div>
    </div>
  );
};
`}/>
          <Text>This component takes in the necessary props for each gift: the wrapped and unwrapped images, a label, the current owner, and the number of times it has been stolen. It also includes functions for handling clicks on the gift and for changing the owner.</Text>
          <Text>Next, you could create a component to manage the queue and track whose turn it is:</Text>
          <CodeBlock language="jsx" content={`import React, { useState } from 'react';

const GiftQueue = ({ participants, onGiftOpened }) => {
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState(0);

  const handleNext = () => {
    setCurrentParticipantIndex((currentParticipantIndex + 1) % participants.length);
  };

  const handleGiftOpened = () => {
    onGiftOpened(participants[currentParticipantIndex].name);
    handleNext();
  };

  return (
    <div className="gift-queue">
      <div className="gift-queue-label">Next up: {participants[currentParticipantIndex].name}</div>
      <button onClick={handleNext}>Skip</button>
      <button onClick={handleGiftOpened}>Open Gift</button>
    </div>
  );
};
`}/>
          <Text>This component takes in an array of participant objects and a function to call when a gift is opened. It uses the currentParticipantIndex state variable to keep track of whose turn it is, and includes functions for advancing to the next participant and for opening a gift.</Text>
          <Text>Finally, you could create a component to represent the entire app and to manage the state of the gifts and the participants:</Text>
          <CodeBlock language="jsx" content={`import React, { useState } from 'react';
import Gift from './Gift';
import GiftQueue from './GiftQueue';

const participants = [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Charlie' },
  { name: 'Dave' },
];

const gifts = [
  {
    id: 1,
    wrappedImage: 'path/to/wrapped/image1',
    unwrappedImage: 'path/to/unwrapped/image1',
    label: 'Gift 1',
    owner: '',
    stolenCount: 0,
  },
  {
    id: 2,
    wrappedImage: 'path/to/wrapped/image2',
    unwrappedImage: 'path/to/unwrapped/image2',
   
`}/>
        </AISection>,
    }
    case 4: return {
      prompt: "I'd like help visualizing this app. Can you use an ASCII diagram to roughly show the visuals?",
      aiResponse: () =>
        <AISection>
          <Text>Sure, here is an ASCII diagram to roughly show how the app could be laid out:</Text>
          <CodeBlock language="jsx" content={`+-----------------------------------------------------------+
|                  Virtual White Elephant                    |
+-----------------------------------------------------------+
|          +---------------+         +---------------+      |
|          |   Gift 1      |         |   Gift 2      |      |
|          +---------------+         +---------------+      |
|          |  Wrapped      |         |  Wrapped      |      |
|          |  Image        |         |  Image        |      |
|          |  (click to    |         |  (click to    |      |
|          |  reveal)      |         |  reveal)      |      |
|          |  +------+     |         |  +------+     |      |
|          |  |      |     |         |  |      |     |      |
|          |  |      |     |         |  |      |     |      |
|          |  +------+     |         |  +------+     |      |
|          |  Gift 1      |         |  Gift 2      |      |
|          |  Label       |         |  Label       |      |
|          |  Owner: Alice|         |  Owner: Bob  |      |
|          +---------------+         +---------------+      |
|          |   Gift 3      |         |   Gift 4      |      |
|          +---------------+         +---------------+      |
|          |  Wrapped      |         |  Wrapped      |      |
|          |  Image        |         |  Image        |      |
|          |  (click to    |         |  (click to    |      |
|          |  reveal)      |         |  reveal)      |      |
|          |  +------+     |         |  +------+     |      |
|          |  |      |     |         |  |      |     |      |
|          |  |      |     |         |  |      |     |      |
|          |  +------+     |         |  +------+     |      |
|          |  Gift 3      |         |  Gift 4      |      |
|          |  Label       |         |  Label       |      |
|          |  Owner:      |         |  Owner: Charlie|      |
|          +---------------+         +---------------+      |
|          |   Gift 5      |         |   Gift 6      |      |
|          +---------------+         +---------------+      |
|          |  Wrapped      |         |  Wrapped      |      |
|          |  Image        |         |  Image        |      |
|          |  (click to    |         |  (click to    |      |
|          |  reveal)      |         |  reveal)      |      |
|          |  +------+     |         |  +------+     |      |
|          |  |      |     |         |  |      |     |      |
|          |  |      |     |         |  |      |     |      |
|          |  +------+     |         |  +------+     |      |
|          |  Gift 5      |         |  Gift 6      |      |
|          |  Label       |         |  Label       |      |
|          |  Owner: Dave |         |  Owner:       |      |
|          +---------------+         +---------------+      |
|                                                           |
|  Next up: Alice                                           |
|  [Skip] [Open Gift]                                       |
|                                                           |
+-----------------------------------------------------------+
          `}/>
        </AISection>,
    }
    case 5: return {
      prompt: "I'd like to add a menu where I can browse he entire list of participants, with checkboxes next to them depending on whether they have a gift or not. Can you create the React component for that?",
      aiResponse: () =>
        <AISection>
          <Text>Sure, here's a rough idea of what the component could look like:</Text>
          <CodeBlock language="javascript" content={`import React from 'react';

function ParticipantList(props) {
  const participants = props.participants;
  const gifts = props.gifts;

  return (
    <div>
      <h2>Participant List</h2>
      {participants.map((participant, index) => {
        const hasGift = gifts.some(gift => gift.owner === participant.name);
        return (
          <div key={index}>
            <input type="checkbox" checked={hasGift} readOnly />
            {participant.name}
          </div>
        );
      })}
    </div>
  );
}

export default ParticipantList;
          `}/>
          <Text>This assumes that you have an array of participants and an array of gifts that have an owner property corresponding to the name of the participant who owns the gift. The component renders a list of checkboxes for each participant, indicating whether they have a gift or not. The checkboxes are read-only so that they can't be changed by the user.</Text>
        </AISection>
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