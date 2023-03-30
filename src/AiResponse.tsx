import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  Linking,
  Pressable,
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
  ChatHistoryContext,
  ChatSource,
} from './Chat';
import { StylesContext } from './Styles';
import { FeedbackContext } from './Feedback';
import Clipboard from '@react-native-clipboard/clipboard';
import Markdown from 'react-native-markdown-display';

type AiImageResponseProps = {
  imageUrls?: string[];
  prompt?: string;
  rejectImage: () => void;
  requestMore: () => void;
};
function AiImageResponse({imageUrls, prompt, rejectImage, requestMore}: AiImageResponseProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  return (
    <View
      style={[styles.horizontalContainer, {flexWrap: 'nowrap', alignItems: 'flex-start'}]}>
      {imageUrls?.map((imageUrl, index) => (
        <Pressable
          key={index}
          onPress={() => {
            if (imageUrl) {
              Linking.openURL(imageUrl);
            }
          }}>
          <Image
            accessibilityRole="imagebutton"
            accessibilityLabel={prompt}
            source={{uri: imageUrl}}
            alt={prompt}
            style={styles.dalleImage}/>
        </Pressable>))}
      <View
        style={{flexShrink: 1, gap: 8}}>
        <Text>Here is an image created using the following requirements "{prompt}"</Text>
        <View style={{alignSelf: 'flex-end', alignItems: 'flex-end'}}>
          <Button
            accessibilityLabel="I didn't want to see an image"
            title="I didn't want to see an image"
            onPress={() => rejectImage()}/>
          <Button
            accessibilityLabel="Show me more"
            title="Show me more"
            onPress={() => requestMore()}/>
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
  id: number,
  isLoading?: boolean;
  copyValue?: string;
  contentShownOnHover?: JSX.Element;
}>;
function AiSection({children, id, isLoading, copyValue, contentShownOnHover}: AiSectionProps): JSX.Element {
  const feedbackContext = React.useContext(FeedbackContext);
  const styles = React.useContext(StylesContext);
  const chatHistory = React.useContext(ChatHistoryContext);
  const [hovering, setHovering] = React.useState(false);

  const showFeedbackPopup = (positive: boolean) => {
    if (feedbackContext) {
      feedbackContext.showFeedback(positive, copyValue);
    }
  }

  return (
    <Pressable
      accessibilityRole="none"
      accessibilityLabel="AI response"
      style={[styles.sectionContainer, styles.AiSection]}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}>
      <View style={{flexDirection: 'row'}}>
        <Text
          accessibilityRole="header"
          style={[styles.sectionTitle, {flexGrow: 1}]}>
            OpenAI
        </Text>
        {hovering && contentShownOnHover}
        {hovering && id !== undefined && <HoverButton content="❌" tooltip="Delete this response" onPress={() => chatHistory.deleteResponse(id)}/>}
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
  const firstResult = content.responses ? content.responses[0] : "";
  return (
    <AiSection copyValue={firstResult} id={id}>
      {(() => {
        switch (content.contentType) {
          case ChatContent.Error:
            return <Text style={{color: 'red'}}>{firstResult}</Text>
          case ChatContent.Image:
            return <AiImageResponse
              imageUrls={content.responses}
              prompt={content.prompt}
              rejectImage={() => chatHistory.modifyResponse(id, {intent: 'text', responses: undefined})}
              requestMore={() => chatHistory.add({
                type: ChatSource.Ai,
                id: -1,
                contentType: ChatContent.Error,
                intent: 'image',
                prompt: content.prompt,
              })}/>;
          default:
          case ChatContent.Text:
            return <AiTextResponse text={firstResult}/>
        }
      })()}
    </AiSection>
  )
}

export { AiSectionContent, AiSection, AiImageResponse, AiTextResponse }