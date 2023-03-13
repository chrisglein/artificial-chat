import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  Linking,
  Pressable,
  StyleSheet,
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
import Clipboard from '@react-native-clipboard/clipboard';
import Markdown from 'react-native-markdown-display';

type AiImageResponseProps = {
  imageUrl?: string;
  prompt?: string;
  rejectImage: () => void;
};
function AiImageResponse({imageUrl, prompt, rejectImage}: AiImageResponseProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  return (
    <View style={[styles.horizontalContainer, {flexWrap: 'nowrap', alignItems: 'flex-start'}]}>
      <Pressable
        onPress={() => {
          if (imageUrl) {
            Linking.openURL(imageUrl);
          }
        }}>
        <Image
          source={{uri: imageUrl}}
          alt={prompt}
          style={styles.dalleImage}/>
      </Pressable>
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
  const rules = {
    fence: (node, children, parent, styles) => {
      return (
        <CodeBlock
          key={node.key}
          language={node.sourceInfo}
          content={node.content}/>
        )
      },
  }

  return (
    <Markdown rules={rules}>{text}</Markdown>
  );
}

type AiSectionProps = PropsWithChildren<{
  isLoading?: boolean;
  copyValue?: string;
  contentShownOnHover?: JSX.Element;
}>;
function AiSection({children, isLoading, copyValue, contentShownOnHover}: AiSectionProps): JSX.Element {
  const feedbackContext = React.useContext(FeedbackContext);
  const styles = React.useContext(StylesContext);
  const [hovering, setHovering] = React.useState(false);

  const showFeedbackPopup = (positive: boolean) => {
    if (feedbackContext) {
      feedbackContext.showFeedback(positive, copyValue);
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
        {hovering && copyValue && <HoverButton content="📋" tooltip="Copy to clipboard" onPress={() => Clipboard.setString(copyValue)}/>}
        <HoverButton content="👍" tooltip="Give positive feedback" onPress={() => { showFeedbackPopup(true); }}/>
        <HoverButton content="👎" tooltip="Give negative feedback" onPress={() => { showFeedbackPopup(false); }}/>
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
    <AiSection copyValue={content.text}>
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