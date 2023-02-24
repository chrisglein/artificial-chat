import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  ActivityIndicator,
  Pressable,
  Image,
  Text,
  View,
} from 'react-native';
import {
  OpenAiApi,
  CallOpenAI,
} from './OpenAI';
import { HoverButton } from './Controls';
import { ChatScrollContext } from './Chat';
import { StylesContext } from './Styles';
import { FeedbackContext } from './Feedback';
import { SettingsContext } from './Settings';

type HumanSectionProps = PropsWithChildren<{
    hoverButtonText?: string;
    hoverButtonOnPress?: () => void;
  }>;
function HumanSection({children, hoverButtonText, hoverButtonOnPress}: HumanSectionProps): JSX.Element {
  const [hovering, setHovering] = React.useState(false);
  const styles = React.useContext(StylesContext);

  return (
    <Pressable
      style={[styles.sectionContainer, styles.humanSection]}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}>
      <View style={{flexDirection: 'row', minHeight: 26}}>
        <Text style={[styles.sectionTitle, {flexGrow: 1}]}>HUMAN</Text>
        {hoverButtonText !== "" && hovering && <HoverButton content={hoverButtonText ?? "📝"} onPress={() => hoverButtonOnPress ? hoverButtonOnPress() : {}}/>}
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
  }

  return (
    <View style={[styles.sectionContainer, styles.aiSection]}>
      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.sectionTitle, {flexGrow: 1}]}>AI</Text>
        <HoverButton content="👍" onPress={() => { showFeedbackPopup(true); }}/>
        <HoverButton content="👎" onPress={() => { showFeedbackPopup(false); }}/>
      </View>
      {isLoading && 
        <ActivityIndicator/>
      }
      <View style={{gap: 8}}>
        {children}
      </View>
    </View>
  );
}

type AISectionWithQueryProps = {
  prompt: string;
};
function AISectionWithQuery({prompt}: AISectionWithQueryProps): JSX.Element {
  const settingsContext = React.useContext(SettingsContext);
  const chatScroll = React.useContext(ChatScrollContext);
  const styles = React.useContext(StylesContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [queryResult, setQueryResult] = React.useState<string | undefined>(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);

  let isImagePrompt = prompt.startsWith("Image:");
    
  React.useEffect(() => {
    CallOpenAI({
      api: isImagePrompt ? OpenAiApi.Generations : OpenAiApi.Completion,
      apiKey: settingsContext.apiKey,
      prompt: prompt,
      onError: (error) => {
        setError(error);
      },
      onResult: (result) => {
        setQueryResult(result);
      },
      onComplete: () => {
        setIsLoading(false);
        chatScroll.scrollToEnd();
      }});
    }, [prompt]);

  return (
    <AISection isLoading={isLoading}>
      {error ?
        <Text>{error}</Text> :
        isImagePrompt ? 
          <Image source={{uri: queryResult}} style={styles.dalleImage}/> :
          <Text>{queryResult}</Text>
      }
    </AISection>
  )
}

function AISectionWithFakeResponse({children}: PropsWithChildren): JSX.Element {
  const settingsContext = React.useContext(SettingsContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const chatScroll = React.useContext(ChatScrollContext);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      chatScroll.scrollToEnd();
    }, settingsContext.delayForArtificialResponse ?? 0);
  });

  return (
    <AISection isLoading={isLoading}>
      {!isLoading && children}
    </AISection>
  )
}

export { HumanSection, AISectionWithFakeResponse, AISectionWithQuery }