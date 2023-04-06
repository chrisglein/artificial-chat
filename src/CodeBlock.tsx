import React from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';
import { StylesContext } from './Styles';
//import SyntaxHighlighter from 'react-native-syntax-highlighter';
// See all styles here: https://highlightjs.org/static/demo/
//import { vs2015 } from 'react-syntax-highlighter/styles/hljs';
//import Clipboard from '@react-native-clipboard/clipboard';

const Clipboard = {
  setString: (content: string) => void {
  }
}

const vs2015 = {

}

function SyntaxHighlighter({language, children, customStyle, fontSize, fontFamily, style} : {language: string, children: string, customStyle: any, fontSize: number, fontFamily: string, style: any}) {
  return null;
}

function CodeBlock({content, language} : {content: string, language: string}) {
  const styles = React.useContext(StylesContext);

  return (
    <View>
      <View style={[styles.codeBlockTitle, {flexDirection: 'row', borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingHorizontal: 12}]}>
        <Text
          accessibilityLabel="Language"
          style={[styles.codeBlockTitleText, {flexGrow: 1, alignSelf: "center"}]}>
          {language}
        </Text>
        <Button
          accessibilityLabel="📋 Copy Code"
          title="📋 Copy Code"
          color={styles.codeBlockTitleText.color}
          onPress={() => {
            Clipboard.setString(content);
          }}/>
      </View>
      <SyntaxHighlighter
        style={vs2015}
        customStyle={{padding: 10, borderBottomLeftRadius: 8, borderBottomRightRadius: 8}}
        fontSize={14}
        fontFamily="Courier New"
        language={language}>
          {content}
      </SyntaxHighlighter>
    </View>
  )
}

export { CodeBlock };