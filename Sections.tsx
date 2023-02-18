import React from 'react';
import type {PropsWithChildren} from 'react';
import {ActivityIndicator, Pressable, Text, View} from 'react-native';
import {OpenAIUrl, CallOpenAI} from './OpenAI';
import {HoverButton} from './Controls';
import {StylesContext} from './Styles';
import {FeedbackContext} from './Feedback';
import {SettingsContext} from './Settings';
import AdaptiveCard from 'adaptivecards-reactnative';

type HumanSectionProps = PropsWithChildren<{
  hoverButtonText?: string;
  hoverButtonOnPress?: () => void;
}>;
function HumanSection({
  children,
  hoverButtonText,
  hoverButtonOnPress,
}: HumanSectionProps): JSX.Element {
  const [hovering, setHovering] = React.useState(false);
  const styles = React.useContext(StylesContext);

  return (
    <Pressable
      style={[styles.sectionContainer, styles.humanSection]}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}>
      <View style={{flexDirection: 'row', minHeight: 26}}>
        <Text style={[styles.sectionTitle, {flexGrow: 1}]}>HUMAN</Text>
        {hoverButtonText !== '' && hovering && (
          <HoverButton
            content={hoverButtonText ?? '📝'}
            onPress={() => (hoverButtonOnPress ? hoverButtonOnPress() : {})}
          />
        )}
      </View>
      {children}
    </Pressable>
  );
}

type AISectionProps = PropsWithChildren<{
  isLoading?: boolean;
}>;
function AISection({children, isLoading}: AISectionProps): JSX.Element {
  const feedbackContext = React.useContext(FeedbackContext);
  const styles = React.useContext(StylesContext);

  const showFeedbackPopup = (positive: boolean) => {
    if (feedbackContext) {
      feedbackContext.showFeedback(positive);
    }
  };

  return (
    <View style={[styles.sectionContainer, styles.aiSection]}>
      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.sectionTitle, {flexGrow: 1}]}>AI</Text>
        <HoverButton
          content="👍"
          onPress={() => {
            showFeedbackPopup(true);
          }}
        />
        <HoverButton
          content="👎"
          onPress={() => {
            showFeedbackPopup(false);
          }}
        />
      </View>
      {isLoading && <ActivityIndicator />}
      {children}
    </View>
  );
}

type AISectionWithQueryProps = {
  prompt: string;
};
function AISectionWithQuery({prompt}: AISectionWithQueryProps): JSX.Element {
  const settingsContext = React.useContext(SettingsContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [queryResult, setQueryResult] = React.useState<string | undefined>(
    undefined,
  );

  React.useEffect(() => {
    CallOpenAI({
      url: OpenAIUrl().completion('text-davinci-003-playground'),
      apiKey: settingsContext.apiKey,
      prompt: prompt,
      onError: error => {
        setQueryResult(error);
      },
      onResult: result => {
        setQueryResult(result);
      },
      onComplete: () => {
        setIsLoading(false);
      },
    });
  }, [prompt]);

  return (
    <AISection isLoading={isLoading}>
      <Text>{queryResult}</Text>
    </AISection>
  );
}

function AISectionAdaptiveCards({
  prompt,
}: AISectionWithQueryProps): JSX.Element {
  const settingsContext = React.useContext(SettingsContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [queryResult, setQueryResult] = React.useState<string | undefined>(
    undefined,
  );

  React.useEffect(() => {
    CallOpenAI({
      url: OpenAIUrl().completion('text-davinci-003-playground'),
      apiKey: settingsContext.apiKey,
      prompt: prompt,
      onError: error => {
        setQueryResult(error);
      },
      onResult: result => {
        console.log('Result: ', result);
        console.log(JSON.parse(result));
        setQueryResult(result);
      },
      onComplete: () => {
        setIsLoading(false);
      },
    });
  }, [prompt]);

  return (
    <AISection isLoading={isLoading}>
      <Text>
        Thank you! Here is what I was able to come up with the information you
        provided to me:
      </Text>
      {!isLoading && (
        <AdaptiveCard
          payload={JSON.parse(queryResult)}
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
      )}
    </AISection>
  );
}

export {HumanSection, AISection, AISectionWithQuery, AISectionAdaptiveCards};
