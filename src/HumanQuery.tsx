import React from 'react';
import type {PropsWithChildren} from 'react';
import {Pressable, Text, View} from 'react-native';
import {FlyoutMenu, MarkdownWithRules} from './Controls';
import type {FlyoutMenuButtonType} from './Controls';
import {StylesContext} from './Styles';
import {ChatHistoryContext} from './Chat';
import Clipboard from '@react-native-clipboard/clipboard';

type HumanSectionProps = PropsWithChildren<{
  id?: number;
  content?: string;
  disableCopy?: boolean;
  moreMenu?: FlyoutMenuButtonType[];
}>;
function HumanSection({
  children,
  id,
  content,
  disableCopy,
  moreMenu,
}: HumanSectionProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const chatHistory = React.useContext(ChatHistoryContext);

  // Find the entry to check if it's pinned
  const entry = id !== undefined ? chatHistory.entries.find(e => e.id === id) : undefined;
  const isPinned = entry?.pinned ?? false;

  const menuItems = [];
  if (moreMenu) {
    menuItems.push(...moreMenu);
  }
  if (id !== undefined) {
    // Add pin/unpin option
    menuItems.push({
      title: isPinned ? '📌 Unpin message' : '📌 Pin message',
      icon: 0xE718, // Pin icon
      onPress: () => chatHistory.togglePin(id)
    });
    menuItems.push(
      {title: 'Delete this response', icon: 0xE74D, onPress: () => chatHistory.deleteResponse(id)}
    );
  }
  if (!disableCopy) {
    menuItems.push(
      {title: 'Copy to clipboard', icon: 0xE8C8, onPress: () => Clipboard.setString(content ?? '')}
    );
  }

  return (
    <Pressable
      accessibilityRole="none"
      accessibilityLabel="Human prompt"
      style={[styles.sectionContainer, styles.humanSection]}>
      <View style={{flexDirection: 'row', minHeight: 26}}>
        <Text
          accessibilityRole="header"
          style={[styles.sectionTitle, {flexGrow: 1}]}>
          {isPinned ? '📌 ' : ''}Prompt
        </Text>
        <FlyoutMenu items={menuItems} maxWidth={300} maxHeight={400}/>
      </View>
      {content ? <MarkdownWithRules content={content} /> : null}
      {children}
    </Pressable>
  );
}

export { HumanSection };
