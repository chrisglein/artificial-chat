import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { StylesContext } from './Styles';
import { FluentButton as Button } from './FluentControls';
import Clipboard from '@react-native-clipboard/clipboard';

function CodeBlock({content, language} : {content: string, language: string}): JSX.Element {
  const styles = React.useContext(StylesContext);

  return (
    <View>
      <View
        style={[
          styles.codeBlockTitle,
          {
            flexDirection: 'row',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            paddingHorizontal: 12,
          },
        ]}>
        <Text
          accessibilityLabel="Language"
          style={[styles.codeBlockTitleText, {flexGrow: 1, alignSelf: 'center'}]}>
          {language}
        </Text>
        <Button
          appearance="subtle"
          accessibilityLabel="Copy Code"
          icon={{ fontSource: { fontFamily: 'Segoe MDL2 Assets', codepoint: 0xE8C8, color: styles.codeBlockTitleText.color } }}
          iconOnly={true}
          tooltip="Copy Code"
          onClick={() => {
            Clipboard.setString(content);
          }}
        />
      </View>
      <Text style={[styles.text, {padding: 10, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, fontSize: 14, fontFamily: 'Courier New'}]}>
          {content}
      </Text>
    </View>
  );
}

export { CodeBlock };
