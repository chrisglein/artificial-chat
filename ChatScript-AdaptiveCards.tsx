import React from 'react';
import {Button, Image, Text, View} from 'react-native';
import {AISection} from './Sections';
import {StylesContext} from './Styles';
import AdaptiveCard from 'adaptivecards-reactnative';

const handleAIResponseAdaptiveCards = (index: number, styles, goToNext) => {
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
      };
    default:
      return {
        prompt: undefined,
        aiResponse: undefined,
      };
  }
};

export {handleAIResponseAdaptiveCards};
