import React from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';
import { StylesContext } from './Styles';
import SyntaxHighlighter from 'react-native-syntax-highlighter';
// See all styles here: https://highlightjs.org/static/demo/
import { agate, light } from 'react-syntax-highlighter/styles/hljs';

function CodeBlock({content, language} : {content: string, language: string}) {
  const styles = React.useContext(StylesContext);
  let isDarkTheme = styles.appContent.backgroundColor == 'black';

  return (
    <View>
      <View style={[styles.codeBlockTitle, {flexDirection: 'row', borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingHorizontal: 12}]}>
        <Text style={[styles.codeBlockTitleText, {flexGrow: 1, alignSelf: "center"}]}>{language}</Text>
        <Button title="📋 Copy Code" color={styles.codeBlockTitleText.color}/>
      </View>
      <View style={[styles.codeBlockContent, {borderBottomLeftRadius: 8, borderBottomRightRadius: 8}]}>
        <SyntaxHighlighter
          style={isDarkTheme ? agate : light}
          customStyle={{padding: 10}}
          fontSize={14}
          fontFamily="Courier New"
          language={language}>
            {content}
        </SyntaxHighlighter>
      </View>
    </View>
  )
}

export { CodeBlock };