import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import { HoverButton } from './Controls';
import { StylesContext } from './Styles';
import { ChatHistoryContext } from './Chat';
import { Clipboard } from './Dependencies';

type HumanSectionProps = PropsWithChildren<{
  id?: number,
  content?: string;
  disableCopy?: boolean;
  contentShownOnHover?: React.ReactNode;
}>;
function HumanSection({children, id, content, disableCopy, contentShownOnHover}: HumanSectionProps): JSX.Element {
  const [hovering, setHovering] = React.useState(false);
  const styles = React.useContext(StylesContext);
  const chatHistory = React.useContext(ChatHistoryContext);

  return (
    <Pressable
      accessibilityRole="none"
      accessibilityLabel="Human prompt"
      style={[styles.sectionContainer, styles.humanSection]}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}>
      <View style={{flexDirection: 'row', minHeight: 26}}>
        <Text
          accessibilityRole="header"
          style={[styles.sectionTitle, {flexGrow: 1}]}>
            Prompt
        </Text>
        {hovering && contentShownOnHover}
        {hovering && id !== undefined && <HoverButton content="❌" tooltip="Delete this response" onPress={() => chatHistory.deleteResponse(id)}/>}
        {hovering && !disableCopy && <HoverButton content="📋" tooltip="Copy to clipboard" onPress={() => Clipboard.setString(content ?? "")}/>}
      </View>
      {content ? <Text>{content}</Text> : null}
      {children}
    </Pressable>
  );
}

export { HumanSection }