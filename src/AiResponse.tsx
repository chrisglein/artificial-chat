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
  HoverButton,
  CodeBlock
} from './Controls';
import {
  ChatElement,
  ChatContent,
  ChatHistoryContext
} from './Chat';
import { StylesContext } from './Styles';
import { FeedbackContext } from './Feedback';

type AiImageResponseProps = {
  imageUrl?: string;
  prompt?: string;
  rejectImage: () => void;
};
function AiImageResponse({imageUrl, prompt, rejectImage}: AiImageResponseProps): JSX.Element {
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
            onPress={() => rejectImage()}/>
          <Button
            title="Show me more"
            onPress={() => console.log("Not yet implemented")}/>
        </View>
      </View>
    </View>
  );
}

type AiTextResponseProps = {
  text?: string;
};
function AiTextResponse({text}: AiTextResponseProps): JSX.Element {
  let elements: JSX.Element[] = [];

  function* matchAll(text: string, regexp: RegExp) {
    let match;
    while ((match = regexp.exec(text)) !== null) {
      yield {value: match, start: match.index, end: regexp.lastIndex};
    }
  }

  // Break up the text into code blocks and regular text
  if (text !== undefined) {
    // Look for the ``` separator (with option language)
    const regex = /^```(.*)$/gm;
    let matches = [...matchAll(text, regex)];

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
      let textSinceLast = text.substring(index, match.start).trim();
      index = match.start + match.value[0].length;

      appendToElements(i, textSinceLast);

      currentLanguage = match.value[1];
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

type AiSectionProps = PropsWithChildren<{
  isLoading?: boolean;
  contentShownOnHover?: JSX.Element;
}>;
function AiSection({children, isLoading, contentShownOnHover}: AiSectionProps): JSX.Element {
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
      style={[styles.sectionContainer, styles.AiSection]}
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

type AiSectionContentProps = {
  id: number,
  content: ChatElement;
}
function AiSectionContent({id, content}: AiSectionContentProps): JSX.Element {
  const chatHistory = React.useContext(ChatHistoryContext);
  return (
    <AiSection>
      {(() => {
        switch (content.contentType) {
          case ChatContent.Error:
            return <Text style={{color: 'red'}}>{content.text}</Text>
          case ChatContent.Image:
            return <AiImageResponse
              imageUrl={content.text}
              prompt={content.prompt}
              rejectImage={() => chatHistory.modifyResponse(id, {intent: 'text', text: undefined})}/>;
          default:
          case ChatContent.Text:
            return <AiTextResponse text={content.text}/>
        }
      })()}
    </AiSection>
  )
}

export { AiSectionContent, AiSection, AiImageResponse, AiTextResponse }