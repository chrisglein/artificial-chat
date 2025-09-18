import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';
import {FlyoutMenu, MarkdownWithRules} from './Controls';
import type {FlyoutMenuButtonType} from './Controls';
import {FluentButton as Button} from './FluentControls';
import {ChatElement, ChatContent, ChatHistoryContext, ChatSource} from './Chat';
import {StylesContext} from './Styles';
import {FeedbackContext} from './Feedback';
import Clipboard from '@react-native-clipboard/clipboard';
import {Speak} from './Speech';

type AiImageResponseProps = {
  imageUrls?: string[];
  prompt?: string;
  rejectImage?: () => void;
  requestMore: () => void;
};
function AiImageResponse({
  imageUrls,
  prompt,
  rejectImage,
  requestMore,
}: AiImageResponseProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  return (
    <View
      style={[
        styles.horizontalContainer,
        {flexWrap: 'nowrap', alignItems: 'flex-start'},
      ]}>
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
            style={styles.dalleImage}
          />
        </Pressable>
      ))}
      <View style={{flexShrink: 1, gap: 8}}>
        <Text>
          Here is an image created using the following requirements "{prompt}"
        </Text>
        <View style={{alignSelf: 'flex-end', alignItems: 'flex-end'}}>
          {rejectImage && (
            <Button
              title="I didn't want to see an image"
              onClick={() => rejectImage()}
            />
          )}
          <Button
            title="Show me more"
            onClick={() => requestMore()}
          />
        </View>
      </View>
    </View>
  );
}

type AiSectionProps = PropsWithChildren<{
  id: number;
  isLoading?: boolean;
  copyValue?: string;
  moreMenu?: FlyoutMenuButtonType[];
}>;
function AiSection({
  children,
  id,
  isLoading,
  copyValue,
  moreMenu,
}: AiSectionProps): JSX.Element {
  const feedbackContext = React.useContext(FeedbackContext);
  const styles = React.useContext(StylesContext);
  const chatHistory = React.useContext(ChatHistoryContext);

  const showFeedbackPopup = (positive: boolean) => {
    if (feedbackContext) {
      feedbackContext.showFeedback(positive, copyValue);
    }
  };

  const menuItems = [];
  if (moreMenu) {
    menuItems.push(...moreMenu);
  }
  if (id !== undefined) {
    menuItems.push(
      {title: 'Delete this response', icon: 0xE74D, onPress: () => chatHistory.deleteResponse(id)}
    );
  }
  if (copyValue) {
    menuItems.push(
      {title: 'Copy to clipboard', icon: 0xE8C8, onPress: () => Clipboard.setString(copyValue)}
    );
    menuItems.push(
      {title: 'Read to me', icon: 0xE995, onPress: () => { Speak(copyValue); } }
    );
  }
  menuItems.push(
    {title: '👍 Give positive feedback', onPress: () => { showFeedbackPopup(true); }},
    {title: '👎 Give negative feedback', onPress: () => { showFeedbackPopup(false); }},
  );

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
        <FlyoutMenu items={menuItems} maxWidth={300} maxHeight={400}/>
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
  id: number;
  content: ChatElement;
};
function AiSectionContent({id, content}: AiSectionContentProps): JSX.Element {
  const chatHistory = React.useContext(ChatHistoryContext);
  const firstResult = content.responses ? content.responses[0] : '';
  return (
    <AiSection copyValue={firstResult} id={id}>
      {(() => {
        switch (content.contentType) {
          case ChatContent.Error:
            return <Text style={{color: 'red'}}>{firstResult}</Text>;
          case ChatContent.Image:
            return (
              <AiImageResponse
                imageUrls={content.responses}
                prompt={content.prompt}
                rejectImage={
                  content.intent
                    ? undefined
                    : () =>
                        chatHistory.modifyResponse(id, {
                          intent: 'text',
                          responses: undefined,
                        })
                }
                requestMore={() =>
                  chatHistory.add({
                    type: ChatSource.Ai,
                    id: -1,
                    contentType: ChatContent.Error,
                    intent: 'image',
                    prompt: content.prompt,
                  })
                }
              />
            );
          default:
          case ChatContent.Text:
            return <MarkdownWithRules content={firstResult}/>;
        }
      })()}
    </AiSection>
  );
}

export { AiSectionContent, AiSection, AiImageResponse };
