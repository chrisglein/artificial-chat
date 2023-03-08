import React from 'react';
import { Appearance } from 'react-native';
import { ChatSession } from './AppContent';
import {
  StylesContext,
  CreateStyles,
} from './Styles';
import { SettingsContext } from './Settings';

function App(): JSX.Element {
  const [currentTheme, setCurrentTheme] = React.useState(Appearance.getColorScheme());
  const [apiKey, setApiKey] = React.useState<string | undefined>(undefined);
  const [scriptName, setScriptName] = React.useState<string | undefined>("");
  const [delayForArtificialResponse, setDelayForArtificialResponse] = React.useState<number>(1500);
  
  const isDarkMode = currentTheme === 'dark';

  const onAppThemeChanged = () => {
    setCurrentTheme(Appearance.getColorScheme());
  };

  React.useEffect(() => {
    Appearance.addChangeListener(onAppThemeChanged);
  });

  return (
    <StylesContext.Provider value={CreateStyles(isDarkMode)}>
      <SettingsContext.Provider value={{
          scriptName: scriptName,
          setScriptName: setScriptName,
          apiKey: apiKey,
          setApiKey: setApiKey,
          delayForArtificialResponse: delayForArtificialResponse,
          setDelayForArtificialResponse: setDelayForArtificialResponse,
        }}>
        <ChatSession/>
      </SettingsContext.Provider>
    </StylesContext.Provider>
  );
}

export default App;
