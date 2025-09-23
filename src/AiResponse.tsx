import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  PlatformColor,
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
import {ContentDialog} from './Popups';

type ImageButtonProps = {
  imageUrl: string;
  alt: string;
  onPress: () => void;
  imageStyle: any;
};

function ImageButton({imageUrl, alt, onPress, imageStyle}: ImageButtonProps): JSX.Element {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);

  const getImageContainerStyle = () => {
    return {
      borderWidth: 1,
      borderRadius: 4,
      borderColor: (isHovered || isPressed)
        ? PlatformColor('ControlStrokeColorSecondary')
        : 'transparent',
      backgroundColor: isPressed
        ? PlatformColor('ControlFillColorSecondary')
        : isHovered
        ? PlatformColor('ControlFillColorDefault')
        : 'transparent',
    };
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      accessibilityRole="imagebutton"
      accessibilityLabel={alt}
      style={getImageContainerStyle()}>
      <Image
        source={{uri: imageUrl}}
        alt={alt}
        style={imageStyle}
      />
    </Pressable>
  );
}

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
  const [zoomedImageUrl, setZoomedImageUrl] = React.useState<string | null>(null);

  const buttons = [
    {
      title: 'Download',
      onPress: () => {
        if (zoomedImageUrl) {
          Linking.openURL(zoomedImageUrl);
        }
      },
    },
    {
      title: 'Close',
      onPress: () => { },
    },
  ];

  return (
    <View
      style={[
        styles.horizontalContainer,
        {flexWrap: 'nowrap', alignItems: 'flex-start'},
      ]}>
      {imageUrls?.map((imageUrl, index) => (
        <ImageButton
          key={index}
          imageUrl={imageUrl}
          alt={prompt || ''}
          onPress={() => setZoomedImageUrl(imageUrl)}
          imageStyle={styles.dalleImage}
        />
      ))}
      <View style={{flexShrink: 1, gap: 8}}>
        <Text style={styles.text}>
          Here is an image created using the following requirements "{prompt}"
        </Text>
        <View style={[styles.text, {alignSelf: 'flex-end', alignItems: 'flex-end'}]}>
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
      
      <ContentDialog
        title="Image Viewer"
        show={zoomedImageUrl !== null}
        close={() => setZoomedImageUrl(null)}
        defaultButtonIndex={1}
        buttons={buttons}
        maxWidth={600}
        maxHeight={600}>
        <Image
          accessibilityRole="image"
          accessibilityLabel={`Zoomed view of ${prompt}`}
          source={{uri: zoomedImageUrl}}
          style={{
            width: 512,
            height: 512,
            resizeMode: 'contain',
          }}
        />
      </ContentDialog>
    </View>
  );
}

type AiSectionProps = PropsWithChildren<{
  id: number;
  isLoading?: boolean;
  copyValue?: string;
  moreMenu?: FlyoutMenuButtonType[];
  pinned?: boolean;
}>;
function AiSection({
  children,
  id,
  isLoading,
  copyValue,
  moreMenu,
  pinned = false,
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
    // Add pin/unpin option
    menuItems.push({
      title: pinned ? 'Unpin message' : 'Pin message',
      icon: 0xE718, // Pin icon
      onPress: () => chatHistory.togglePin(id)
    });
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
          {pinned ? '📌 ' : ''}OpenAI
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
    <AiSection copyValue={firstResult} id={id} pinned={content.pinned}>
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
