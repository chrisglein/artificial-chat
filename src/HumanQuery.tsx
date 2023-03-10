import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import { HoverButton } from './Controls';
import { StylesContext } from './Styles';
import Clipboard from '@react-native-clipboard/clipboard';


type HumanSectionProps = PropsWithChildren<{
  content?: string;
  disableEdit?: boolean;
  disableCopy?: boolean;
  contentShownOnHover?: React.ReactNode;
}>;
function HumanSection({children, content, disableEdit, disableCopy, contentShownOnHover}: HumanSectionProps): JSX.Element {
  const [hovering, setHovering] = React.useState(false);
  const styles = React.useContext(StylesContext);

  return (
    <Pressable
      style={[styles.sectionContainer, styles.humanSection]}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}>
      <View style={{flexDirection: 'row', minHeight: 26}}>
        <Text style={[styles.sectionTitle, {flexGrow: 1}]}>HUMAN</Text>
        {hovering && !disableCopy && <HoverButton content="📋" tooltip="Copy to clipboard" onPress={() => Clipboard.setString(content ?? "")}/>}
        {hovering && !disableEdit && <HoverButton content="📝" tooltip="Edit" onPress={() => {console.log("Edit: Not yet implemented")}}/>}
        {hovering && contentShownOnHover}
      </View>
      {content ? <Text>{content}</Text> : null}
      {children}
    </Pressable>
  );
}

export { HumanSection }