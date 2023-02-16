import React from 'react';
import type {PropsWithChildren} from 'react'
import { Pressable, Text, View } from 'react-native';

type FeedbackButtonProps = PropsWithChildren<{
  content: string;
  onPress: () => void;
}>;
function FeedbackButton({content, onPress}: FeedbackButtonProps): JSX.Element {
  const [hovering, setHovering] = React.useState(false);

  const backgroundBaseStyle = {padding: 2, borderRadius: 8, borderWidth: 1, borderColor: 'transparent'};
  const backgroundPressedStyle = {borderColor: 'white', backgroundColor: 'black'};
  const backgroundHoverStyle = {borderColor: 'white', backgroundColor: 'gray'};
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}>
      {({pressed}) => (
        <View style={[backgroundBaseStyle, pressed ? backgroundPressedStyle : hovering ? backgroundHoverStyle : null]}>
          <Text >{content}</Text>
        </View>        
      )}
    </Pressable>
  );
}

export { FeedbackButton };