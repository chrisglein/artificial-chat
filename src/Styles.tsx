import React from 'react';
import { StyleSheet } from 'react-native';

const StylesContext = React.createContext<{
  appContent: any;
  popupBackground: any;
  sectionContainer: any;
  humanSection: any;
  AiSection: any;
  sectionTitle: any;
  highlight: any;
  horizontalContainer: any;
  dalleImage: any;
  inlineCard: any;
  feedbackDialog: any;
  codeBlockTitle: any;
  codeBlockTitleText: any;
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
  });
}

export { StylesContext, CreateStyles };