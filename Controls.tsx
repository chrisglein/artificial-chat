import React from 'react';
import type {PropsWithChildren} from 'react'
import {
  Button,
  Image,
  Pressable,
  Text,
  Switch,
  View,
} from 'react-native';
import {
  StylesContext,
} from './Styles';

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

type AttributionProps = PropsWithChildren<{
  source: string;
}>;
function Attribution({source}: AttributionProps): JSX.Element {
  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={{fontSize: 12, fontStyle: 'italic'}}>source:</Text>
      <Text style={{fontSize: 12, marginHorizontal: 4}}>{source}</Text>
      <Text style={{fontSize: 12}}>🔍</Text>
    </View>
  );
}

type ConsentSwitchProps = PropsWithChildren<{
  title: string;
  source: string;
  details: string;
  defaultValue?: boolean;
}>;
function ConsentSwitch({title, source, defaultValue, details}: ConsentSwitchProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const [value, onValueChange] = React.useState(defaultValue);

  return (
    <View
      style={[styles.horizontalContainer, {marginBottom: 8}]}
      tooltip={details}>
      <Switch value={value} onValueChange={onValueChange}/>
      <View>
        <Text>{title}</Text>
        <Attribution source={source}/>
      </View>
    </View>
  );
}


type ImageSelectionProps = PropsWithChildren<{
  image: ImageSourcePropType;
}>;
function ImageSelection({image}: ImageSelectionProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  return (
    <View>
      <Image style={styles.dalleImage} source={image}/>
      <View style={[styles.horizontalContainer, {marginTop: 4, justifyContent: 'space-between'}]}>
        <Button title="Variations"/>
        <Button title="Select"/>
      </View>
    </View>
  );
}

export { FeedbackButton, Attribution, ConsentSwitch, ImageSelection };