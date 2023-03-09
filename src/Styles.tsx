import React from 'react';
import type {
  StyleProp,
  ImageStyle,
  TextStyle,
  ViewStyle
} from 'react-native';
import { StyleSheet } from 'react-native';

const StylesContext = React.createContext<{
  appContent: StyleProp<ViewStyle>;
  popupBackground: StyleProp<ViewStyle>;
  sectionContainer: StyleProp<ViewStyle>;
  humanSection: StyleProp<ViewStyle>;
  AiSection: StyleProp<ViewStyle>;
  sectionTitle: StyleProp<TextStyle>;
  highlight: StyleProp<ViewStyle>;
  horizontalContainer: StyleProp<ViewStyle>;
  dalleImage: StyleProp<ImageStyle>;
  inlineCard: StyleProp<ViewStyle>;
  feedbackDialog: StyleProp<ViewStyle>;
  codeBlockTitle: StyleProp<TextStyle>;
  codeBlockTitleText: StyleProp<TextStyle>;
  hyperlinkIdle: StyleProp<TextStyle>;
  hyperlinkPressing: StyleProp<TextStyle>;
  hyperlinkHovering: StyleProp<TextStyle>;
}>({});

const CreateStyles = (isDarkMode: boolean) => {
  return StyleSheet.create({
    appContent: {
      backgroundColor: isDarkMode ? 'black' : 'white',
      justifyContent: 'space-between',
      height: '100%',
    },
    popupBackground: {
      backgroundColor: isDarkMode ? 'white' : 'black',
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0.3,
    },
    sectionContainer: {
      marginHorizontal: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    humanSection: {
      backgroundColor: isDarkMode ? '#333355' : 'lightblue',
      marginRight: 64,
    },
    AiSection: {
      backgroundColor: isDarkMode ? '#444444' : 'lightgray',
      marginLeft: 64,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '600',
    },
    highlight: {
      fontWeight: '700',
    },
    horizontalContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 12,
    },
    dalleImage: {
      width: 150,
      height: 150,
    },
    inlineCard: {
      borderColor: 'gray',
      borderWidth: 2,
      borderRadius: 8,
      padding: 8,
    },
    feedbackDialog: {
      backgroundColor: isDarkMode ? 'black' : 'white',
      padding: 12,
      borderRadius: 8,
      minWidth: 300
    },
    codeBlockTitle: {
      backgroundColor: isDarkMode ? 'white' : '#444',
    },
    codeBlockTitleText: {
      color: isDarkMode ? 'black' : 'white',
    },
    hyperlinkIdle: {
      color: isDarkMode ? 'black' : 'white',
    },
    hyperlinkPressing: {
      color: 'purple',
    },
    hyperlinkHovering: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
  });
}

export { StylesContext, CreateStyles };