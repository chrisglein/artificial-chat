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
  imageSize?: 256 | 512 | 1024,
  setImageSize: (value: 256 | 512 | 1024 | undefined) => void,
}
const SettingsContext = React.createContext<SettingsContextType>({
  setApiKey: () => {},
  setScriptName: () => {},
  setDelayForArtificialResponse: () => {},
  setImageSize: () => {},
});

// Settings that are saved between app sessions
type SettingsData = {
  apiKey?: string,
  imageSize?: 256 | 512 | 1024,
}

// Read settings from app storage
const SaveSettingsData = async (value: SettingsData) => {
  console.debug('Saving settings data...');
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(settingsKey, jsonValue);
    console.debug('Done saving settings data');
  } catch (e) {
    console.error(e);
  }
}

// Write settings to ap storage
const LoadSettingsData = async () => {
  console.debug('Loading settings data...');
  let value : SettingsData = {};
  try {
    const jsonValue = await AsyncStorage.getItem(settingsKey);
    if (jsonValue != null) {
      const data = JSON.parse(jsonValue);
      
      if (data.hasOwnProperty('apiKey')) { value.apiKey = data.apiKey; }
      if (data.hasOwnProperty('imageSize')) { value.imageSize = data.imageSize; }
    }
  } catch(e) {
    console.error(e);
  }
  return value;
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
  const [imageSize, setImageSize] = React.useState<256 | 512 | 1024>(settings.imageSize ?? 256);

  // It may seem weird to do this when the UI loads, not the app, but it's okay
  // because this component is loaded when the app starts but isn't shown. And
  // this popup needs to directly know when the settings change (which won't 
  // happen directly if you just consume settings.apiKey inside the component.
  React.useEffect(() => {
    const load = async () => {
      let value = await LoadSettingsData();

      setApiKey(value.apiKey);
      settings.setApiKey(value.apiKey);

      setImageSize(value.imageSize ?? 256);
      settings.setImageSize(value.imageSize);

      // If an API key was set, continue to remember it
      setSaveApiKey(value.apiKey !== undefined);
    }
    load();
  }, []);

  const save = () => {
    settings.setApiKey(apiKey);
    settings.setImageSize(imageSize);
    settings.setScriptName(scriptName);
    settings.setDelayForArtificialResponse(delayForArtificialResponse);

    close();

    SaveSettingsData({
      apiKey: saveApiKey ? apiKey : undefined,
      imageSize: imageSize,
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
          style={{height: 50, width: 200}}
          selectedValue={scriptName}
          onValueChange={(value) => setScriptName(value)}>
          {ChatScriptNames.map(name => <Picker.Item label={name} value={name} key={name}/>)}
          <Picker.Item label="None" value=""/>
        </Picker>
      </View>
      <View>
        <Text>Artificial Delay in Script Response</Text>
        <TextInput
          accessibilityLabel="Artificial Delay in Script Response"
          keyboardType="numeric"
          style={{flexGrow: 1, minHeight: 32}}
          onChangeText={value => setDelayForArtificialResponse(parseInt(value))}
          value={delayForArtificialResponse.toString()}/>
      </View>
      <View>
        <Text accessibilityRole="header" style={styles.dialogSectionHeader}>Image Generation</Text>
        <View>
          <Text>Image Size</Text>
          <Picker
            accessibilityLabel="Image Size"
            style={{height: 50, width: 200}}
            selectedValue={imageSize}
            onValueChange={(value) => setImageSize(value)}>
            {[256, 512, 1024].map(size => <Picker.Item label={size.toString()} value={size} key={size}/>)}
          </Picker>
        </View>
      </View>
    </DialogFrame>
  );
}

export { SettingsContext, SettingsPopup }