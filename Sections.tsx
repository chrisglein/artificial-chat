import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  ActivityIndicator,
  Button,
  Pressable,
  Image,
  Text,
  View,
} from 'react-native';
import {
  OpenAiApi,
  CallOpenAi,
} from './OpenAI';
import {
  HoverButton,
  CodeBlock
} from './Controls';
import { ChatScrollContext } from './Chat';
import { StylesContext } from './Styles';
import { FeedbackContext } from './Feedback';
import { SettingsContext } from './Settings';

type HumanSectionProps = PropsWithChildren<{
  disableEdit?: boolean;
  disableCopy?: boolean;
  contentShownOnHover?: JSX.Element;
}>;
function HumanSection({children, disableEdit, disableCopy, contentShownOnHover}: HumanSectionProps): JSX.Element {
  const [hovering, setHovering] = React.useState(false);
  const styles = React.useContext(StylesContext);

  return (
    <Pressable
      style={[styles.sectionContainer, styles.humanSection]}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}>
      <View style={{flexDirection: 'row', minHeight: 26}}>
        <Text style={[styles.sectionTitle, {flexGrow: 1}]}>HUMAN</Text>
        {hovering && !disableCopy && <HoverButton content="📋" onPress={() => console.log("Copy: Not yet implemented")}/>}
        {hovering && !disableEdit && <HoverButton content="📝" onPress={() => {console.log("Edit: Not yet implemented")}}/>}
        {hovering && contentShownOnHover}
      </View>
      {children}
    </Pressable>
  );
}

type AIImageResponseType = PropsWithChildren<{
  imageUrl?: string;
  prompt?: string;
  rejectImage: () => void;
}>;
function AIImageResponse({imageUrl, prompt, rejectImage}: AIImageResponseType): JSX.Element {
  const styles = React.useContext(StylesContext);
  return (
    <View style={[styles.horizontalContainer, {flexWrap: 'nowrap', alignItems: 'flex-start'}]}>
      <Image
        source={{uri: imageUrl}}
        alt={prompt}
        style={[{flexGrow: 0}, styles.dalleImage]}/>
      <View
        style={{flexShrink: 1, gap: 8}}>
        <Text>Here is an image created using the following requirements "{prompt}"</Text>
        <View style={{alignSelf: 'flex-end', alignItems: 'flex-end'}}>
          <Button
            title="I didn't want to see an image"
            onPress={() => {rejectImage()}}/>
          <Button
            title="Show me more"
            onPress={() => console.log("Not yet implemented")}/>
        </View>
      </View>
    </View>
  );
}

type AITextResponseType = PropsWithChildren<{
  text?: string;
}>;
function AITextResponse({text}: AITextResponseType): JSX.Element {
  let elements: JSX.Element[] = [];

  // Break up the text into code blocks and regular text
  if (text !== undefined) {
    // Look for the ``` separator (with option language)
    const regex = /^```(.*)$/gm;
    let matches = [...text.matchAll(regex)];

    // Keep track of where we are in the open/close code blocks
    let index = 0;
    let inCodeBlock = false;
    let currentLanguage = "";
    
    const appendToElements = (key: number, value: string) => {
      if (!inCodeBlock) {
        elements = [...elements, <Text key={key}>{value}</Text>];
      } else {
        elements = [...elements, <CodeBlock key={key} language={currentLanguage ?? "unknown"} content={value}/>];
      }
    }

    for (let i = 0; i < matches.length; i++) {
      // Grab the text since the last match, but strip out the separator/language
      let match = matches[i];
      let textSinceLast = text.substring(index, match.index).trim();
      index = match.index + match[0].length;

      appendToElements(i, textSinceLast);

      currentLanguage = match[1];
      inCodeBlock = !inCodeBlock;
    }

    // Add the remaining text after the last ``` separator
    if (index < text.length) {
      appendToElements(matches.length, text.substring(index, text.length).trim());
    }
  }

  return (
    <View style={{gap: 8}}>
      {elements}
    </View>
  );
}
  
type AISectionProps = PropsWithChildren<{
  isLoading?: boolean;
  contentShownOnHover?: JSX.Element;
}>;
function AISection({children, isLoading, contentShownOnHover}: AISectionProps): JSX.Element {
  const feedbackContext = React.useContext(FeedbackContext);
  const styles = React.useContext(StylesContext);
  const [hovering, setHovering] = React.useState(false);

  const showFeedbackPopup = (positive: boolean) => {
    if (feedbackContext) {
      feedbackContext.showFeedback(positive);
    }
  }

  return (
    <Pressable
      style={[styles.sectionContainer, styles.aiSection]}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}>
      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.sectionTitle, {flexGrow: 1}]}>AI</Text>
        {hovering && contentShownOnHover}
        {hovering && <HoverButton content="📋" onPress={() => console.log("Copy: Not yet implemented")}/>}
        <HoverButton content="👍" onPress={() => { showFeedbackPopup(true); }}/>
        <HoverButton content="👎" onPress={() => { showFeedbackPopup(false); }}/>
      </View>
      {isLoading && 
        <ActivityIndicator/>
      }
      <View style={{gap: 8}}>
        {children}
      </View>
    </Pressable>
  );
}

type AISectionWithQueryProps = {
  prompt: string;
};
function AISectionWithQuery({prompt}: AISectionWithQueryProps): JSX.Element {
  const settingsContext = React.useContext(SettingsContext);
  const chatScroll = React.useContext(ChatScrollContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [queryResult, setQueryResult] = React.useState<string | undefined>(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [imagePrompt, setImagePrompt] = React.useState<string | undefined>(undefined);

  const notAnImageSentinel = "N/A";
  React.useEffect(() => {
    setIsLoading(true);
    setError(undefined);
    setImagePrompt(undefined);
    CallOpenAi({
      api: OpenAiApi.ChatCompletion,
      apiKey: settingsContext.apiKey,
      instructions: `You are an assistant helping the user. To aid you, you can use DALL-E which can generate images from a description. Your job is to take the user's prompt and reply with an image prompt. The image prompt should be a comma-separated list of keywords describing the desired image, for example:
      - photography
      - fun
      - scary
      - comics
      - high quality
      - highres
      - art
      - dull colors
      - [name of a photographer]
      - [name of a design studio]
      - [visual adjective]
      - [style of the image]
      Where items enclosed in brackets would be replaced with an appropriate suggestion.

      If the user's prompt does not PRIMARILY seem to include a request for an image, respond with "${notAnImageSentinel}" (and no other punctuation). Otherwise, respond with the image prompt string.`,
      prompt: prompt,
      onError: (error) => {
        setImagePrompt(notAnImageSentinel);
      },
      onResult: (result) => {
        setImagePrompt(result);
      },
      onComplete: () => {
      }});
    }, [prompt]);
    
  React.useEffect(() => {
    if (imagePrompt === undefined) {
      return;
    }
    setIsLoading(true);
    CallOpenAi({
      api: imagePrompt !== notAnImageSentinel ? OpenAiApi.Generations : OpenAiApi.ChatCompletion,
      apiKey: settingsContext.apiKey,
      instructions: `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. If the response involves code, use markdown format for that with \`\`\`(language) blocks.`,
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
    }, [prompt, imagePrompt]);

  return (
    <AISection isLoading={isLoading}>
      {
        (isLoading || error) ?
          <Text style={{color: 'crimson'}}>{error}</Text>
        : (imagePrompt !== notAnImageSentinel) ? 
          <AIImageResponse
            imageUrl={queryResult}
            prompt={imagePrompt}
            rejectImage={() => {
              setImagePrompt(notAnImageSentinel);
              setQueryResult(undefined);
          }}/>
        : // Not an error, not an image
          <AITextResponse
            text={queryResult}/>
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