import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import { StylesContext } from './Styles';
import { ChatHistoryContext } from './Chat';
import Clipboard from '@react-native-clipboard/clipboard';
import { ButtonV1 as Button } from '@fluentui/react-native';

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
        {hovering && id !== undefined && 
          <Button
            size="small"
            shape="circular"
            tooltip="Delete this response"
            onClick={() => chatHistory.deleteResponse(id)}>
              ❌
          </Button>}
        {hovering && !disableCopy && 
          <Button
            size="small"
            shape="circular"
            tooltip="Copy to clipboard"
            onClick={() => Clipboard.setString(content ?? "")}>
              📋
          </Button>}
      </View>
      {content ? <Text>{content}</Text> : null}
      {children}
    </Pressable>
  );
}

export { HumanSection }