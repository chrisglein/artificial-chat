import React from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';
import {
  StylesContext,
} from './Styles';

function CodeBlock({content, language} : {content: string, language: string}) {
  const styles = React.useContext(StylesContext);
  return (
    <View>
      <View style={[styles.codeBlockTitle, {flexDirection: 'row', borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingHorizontal: 12}]}>
        <Text style={[styles.codeBlockTitleText, {flexGrow: 1, alignSelf: "center"}]}>{language}</Text>
        <Button title="📋 Copy Code" color={styles.codeBlockTitleText.color}/>
      </View>
      <View style={[styles.codeBlockContent, {borderBottomLeftRadius: 8, borderBottomRightRadius: 8}]}>
        <Text style={{fontFamily: "Courier New", margin: 10}}>{content}</Text>
      </View>
    </View>
  )
}

export { CodeBlock };