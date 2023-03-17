import React from 'react';
import {
  Button,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {DialogFrame} from './Popups';
import {Hyperlink} from './Controls';
import {StylesContext} from './Styles';
import {Picker} from '@react-native-picker/picker';
import {ChatScriptNames} from './ChatScript';
import AsyncStorage from '@react-native-async-storage/async-storage';

const settingsKey = 'settings';

// App-wide settings that can be modified from a menu, some of which are saved between app sessions
type SettingsContextType = {
  apiKey?: string,
  setApiKey: (value?: string) => void,
  scriptName?: string,
  setScriptName: (value: string) => void,
  delayForArtificialResponse?: number,
  setDelayForArtificialResponse: (value: number) => void,
}
const SettingsContext = React.createContext<SettingsContextType>({
  setApiKey: () => {},
  setScriptName: () => {},
  setDelayForArtificialResponse: () => {},
});

// Settings that are saved between app sessions
type SettingsData = {
  apiKey?: string,
}

// Read settings from app storage
const SaveSettingsData = async (value: SettingsData) => {
  console.debug('Saving settings data...');
  try {
    const valueAsString = JSON.stringify(value);
    await AsyncStorage.setItem(settingsKey, valueAsString)
    console.debug('Done saving settings data');
  } catch (e) {
    console.error(e);
  }
}

// Write settings to app storage
const LoadSettingsData = async () => {
  console.debug('Loading settings data...');
  let valueToSave : SettingsData = {};
  try {
    const valueAsString = await AsyncStorage.getItem(settingsKey);
    if (valueAsString != null) {
      const value = JSON.parse(valueAsString);
      
      if (value.hasOwnProperty('apiKey')) { valueToSave.apiKey = value.apiKey; }
    }
  } catch(e) {
    console.error(e);
  }
  return valueToSave;
}

type SettingsPopupProps = {
  show: boolean;
  close: () => void;
}
function SettingsPopup({show, close}: SettingsPopupProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const settings = React.useContext(SettingsContext);
  const [apiKey, setApiKey] = React.useState<string | undefined>(settings.apiKey);
  const [saveApiKey, setSaveApiKey] = React.useState<boolean>(false);
  const [scriptName, setScriptName] = React.useState<string>(settings.scriptName ?? "");
  const [delayForArtificialResponse, setDelayForArtificialResponse] = React.useState<number>(settings.delayForArtificialResponse ?? 0);

  // It may seem weird to do this when the UI loads, not the app, but it's okay
  // because this component is loaded when the app starts but isn't shown. And
  // this popup needs to directly know when the settings change (which won't 
  // happen directly if you just consume settings.apiKey inside the component.
  React.useEffect(() => {
    const load = async () => {
      let value = await LoadSettingsData();
      setApiKey(value.apiKey);
      settings.setApiKey(value.apiKey);

      // If an API key was set, continue to remember it
      setSaveApiKey(value.apiKey !== undefined);
    }
    load();
  }, []);

  const save = () => {
    settings.setApiKey(apiKey);
    settings.setScriptName(scriptName);
    settings.setDelayForArtificialResponse(delayForArtificialResponse);

    close();

    SaveSettingsData({
      apiKey: saveApiKey ? apiKey : undefined
    });
  }

  const buttons = [
    <Button
      accessibilityLabel="OK"
      title="OK"
      onPress={() => {
        save();
      }}/>
    ];

  return (
    <DialogFrame
      show={show}
      close={close}
      titleIcon="⚙️"
      title="OpenAI Settings"
      buttons={buttons}>
      <View>
        <Text>OpenAI API key</Text>
        <TextInput
          accessibilityLabel='OpenAI API key'
          secureTextEntry={true}
          style={{flexGrow: 1, minHeight: 32}}
          onChangeText={value => setApiKey(value)}
          value={apiKey}/>
          <View style={styles.horizontalContainer}>
            <Switch
              accessibilityLabel="Remember this"
              value={saveApiKey}
              onValueChange={(value) => setSaveApiKey(value)}/>
            <Text>Remember this </Text>
          </View>
        <Hyperlink
          url="https://platform.openai.com/account/api-keys"/>
      </View>
      <View>
        <Text accessibilityRole="header" style={styles.dialogSectionHeader}>AI Scripts</Text>
        <Text>Script</Text>
        <Picker
          accessibilityLabel="Script"
          selectedValue={scriptName}
          onValueChange={(value) => setScriptName(value)}>
          {ChatScriptNames.map(name => <Picker.Item label={name} value={name} key={name}/>)}
          <Picker.Item label="None" value=""/>
        </Picker>
        <Text>Artificial Delay in Script Response</Text>
        <TextInput
          accessibilityLabel="Artificial Delay in Script Response"
          keyboardType="numeric"
          style={{flexGrow: 1, minHeight: 32}}
          onChangeText={value => setDelayForArtificialResponse(parseInt(value))}
          value={delayForArtificialResponse.toString()}/>
      </View>
    </DialogFrame>
  );
}

export { SettingsContext, SettingsPopup }