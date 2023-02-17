import React from 'react';
import {
  Appearance,
  StyleSheet,
  View,
} from 'react-native';
import {
  ChatSession,
} from './AppContent';
import {
  StylesContext,
} from './Styles';
import {
  SettingsContext,
} from './Settings';

function App(): JSX.Element {
  const [currentTheme, setCurrentTheme] = React.useState(Appearance.getColorScheme());
  const [apiKey, setApiKey] = React.useState<string | undefined>(undefined);
  const [scriptName, setScriptName] = React.useState<string | undefined>("Dinosaurs");
  const isDarkMode = currentTheme === 'dark';

  const onAppThemeChanged = () => {
    setCurrentTheme(Appearance.getColorScheme());
  };

  React.useEffect(() => {
    Appearance.addChangeListener(onAppThemeChanged);
  });

  const styles : StylesType = StyleSheet.create({
    appContent: {
      backgroundColor: isDarkMode ? 'black' : 'white',
      paddingVertical: 12,
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
    aiSection: {
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
    }
  });

  return (
    <StylesContext.Provider value={styles}>
      <SettingsContext.Provider value={{
          scriptName: scriptName,
          setScriptName: setScriptName,
          apiKey: apiKey,
          setApiKey: setApiKey,
        }}>
        <View>
          <ChatSession/>
        </View>
      </SettingsContext.Provider>
    </StylesContext.Provider>
  );
}

export default App;
