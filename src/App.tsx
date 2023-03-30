import React from 'react';
import {
  Appearance,
  View
} from 'react-native';
import { ChatSession } from './ChatSession';
import {
  StylesContext,
  CreateStyles,
} from './Styles';
import {
  SettingsContext,
  SettingsPopup,
} from './Settings';
import { AboutPopup } from './About';
import { PopupsContext } from './Popups';

function App(): JSX.Element {
  const [currentTheme, setCurrentTheme] = React.useState(Appearance.getColorScheme());
  const [aiEndpoint, setAiEndpoint] = React.useState<string>("https://api.openai.com/v1");
  const [chatModel, setChatModel] = React.useState<string>("gpt-3.5-turbo");
  const [apiKey, setApiKey] = React.useState<string | undefined>(undefined);
  const [scriptName, setScriptName] = React.useState<string | undefined>("");
  const [delayForArtificialResponse, setDelayForArtificialResponse] = React.useState<number>(1500);
  const [imageSize, setImageSize] = React.useState<number>(256);
  const [showSettingsPopup, setShowSettingsPopup] = React.useState(false);
  const [showAboutPopup, setShowAboutPopup] = React.useState(false);
    
  const isDarkMode = currentTheme === 'dark';
  const styles = CreateStyles(isDarkMode);

  const settings = {
    scriptName: scriptName,
    setScriptName: setScriptName,
    apiKey: apiKey,
    setApiKey: setApiKey,
    delayForArtificialResponse: delayForArtificialResponse,
    setDelayForArtificialResponse: setDelayForArtificialResponse,
    imageSize: imageSize,
    setImageSize: setImageSize,
    aiEndpoint: aiEndpoint,
    setAiEndpoint: setAiEndpoint,
    chatModel: chatModel,
    setChatModel: setChatModel,
  };

  const popups = {
    showSettings: showSettingsPopup,
    setShowSettings: setShowSettingsPopup,
    showAbout: showAboutPopup,
    setShowAbout: setShowAboutPopup,
  }

  const onAppThemeChanged = () => {
    setCurrentTheme(Appearance.getColorScheme());
  };

  React.useEffect(() => {
    Appearance.addChangeListener(onAppThemeChanged);
  });

  return (
    <StylesContext.Provider value={styles}>
      <SettingsContext.Provider value={settings}>
        <PopupsContext.Provider value={popups}>
          <View>
            <ChatSession/>
            <SettingsPopup
              show={showSettingsPopup}
              close={() => popups.setShowSettings(false)}/>
            <AboutPopup
              show={popups.showAbout}
              close={() => popups.setShowAbout(false)}/>
          </View>
        </PopupsContext.Provider>
      </SettingsContext.Provider>
    </StylesContext.Provider>
  );
}

export default App;
