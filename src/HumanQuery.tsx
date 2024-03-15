import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import {
  FlyoutMenu,
  FlyoutMenuButton,
} from './Controls';
import { StylesContext } from './Styles';
import { ChatHistoryContext } from './Chat';
import Clipboard from '@react-native-clipboard/clipboard';

type HumanSectionProps = PropsWithChildren<{
  id?: number,
  content?: string;
  disableCopy?: boolean;
  moreMenu?: React.ReactNode;
}>;
function HumanSection({children, id, content, disableCopy, moreMenu}: HumanSectionProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const chatHistory = React.useContext(ChatHistoryContext);

  return (
    <Pressable
      accessibilityRole="none"
      accessibilityLabel="Human prompt"
      style={[styles.sectionContainer, styles.humanSection]}>
      <View style={{flexDirection: 'row', minHeight: 26}}>
        <Text
          accessibilityRole="header"
          style={[styles.sectionTitle, {flexGrow: 1}]}>
            Prompt
        </Text>
        <FlyoutMenu>
          {moreMenu}
          {id !== undefined && 
            <FlyoutMenuButton
              icon={0xE74D}
              onClick={() => chatHistory.deleteResponse(id)}>Delete this response</FlyoutMenuButton>
          }
          {!disableCopy && 
            <FlyoutMenuButton
              icon={0xE8C8}
              onClick={() => Clipboard.setString(content ?? "")}>Copy to clipboard</FlyoutMenuButton>
          }
        </FlyoutMenu>
      </View>
      {content ? <Text>{content}</Text> : null}
      {children}
    </Pressable>
  );
}

export { HumanSection }