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
  FlyoutMenu,
  FlyoutMenuButton,
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
import Markdown from 'react-native-markdown-display-updated';

type AiImageResponseProps = {
  imageUrls?: string[];
  prompt?: string;
  rejectImage?: () => void;
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
          {rejectImage && <Button
            accessibilityLabel="I didn't want to see an image"
            title="I didn't want to see an image"
            onPress={() => rejectImage()}/>}
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
  moreMenu?: JSX.Element;
}>;
function AiSection({children, id, isLoading, copyValue, moreMenu}: AiSectionProps): JSX.Element {
  const feedbackContext = React.useContext(FeedbackContext);
  const styles = React.useContext(StylesContext);
  const chatHistory = React.useContext(ChatHistoryContext);

  const showFeedbackPopup = (positive: boolean) => {
    if (feedbackContext) {
      feedbackContext.showFeedback(positive, copyValue);
    }
  }

  return (
    <Pressable
      accessibilityRole="none"
      accessibilityLabel="AI response"
      style={[styles.sectionContainer, styles.AiSection]}>
      <View style={{flexDirection: 'row'}}>
        <Text
          accessibilityRole="header"
          style={[styles.sectionTitle, {flexGrow: 1}]}>
            OpenAI
        </Text>
        <FlyoutMenu>
          {moreMenu}
          {id !== undefined && 
            <FlyoutMenuButton
              icon={0xE74D}
              onClick={() => chatHistory.deleteResponse(id)}>Delete this response</FlyoutMenuButton>
          }
          {copyValue && 
            <FlyoutMenuButton
              icon={0xE8C8}
              onClick={() => Clipboard.setString(copyValue)}>Copy to clipboard</FlyoutMenuButton>
          }
          <FlyoutMenuButton onClick={() => { showFeedbackPopup(true); }}>👍 Give positive feedback</FlyoutMenuButton>
          <FlyoutMenuButton onClick={() => { showFeedbackPopup(false); }}>👎 Give negative feedback</FlyoutMenuButton>
        </FlyoutMenu>
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
              rejectImage={content.intent ? undefined : () => chatHistory.modifyResponse(id, {intent: 'text', responses: undefined})}
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