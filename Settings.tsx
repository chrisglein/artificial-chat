import React from 'react';
import {
  Button,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Popup} from 'react-native-windows';
import {Hyperlink} from './Controls';
import {StylesContext} from './Styles';
import {Picker} from '@react-native-picker/picker';

type SettingsType = {
  apiKey?: string,
  scriptName?: string,
  setScriptName: (value: string) => void,
}
  
const SettingsContext = React.createContext<SettingsType>({});

type SettingsPopupProps = {
  show: boolean;
  close: () => void;
}
function SettingsPopup({show, close}: SettingsPopupProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const settings = React.useContext(SettingsContext);
  const [scriptName, setScriptName] = React.useState<string | undefined>(settings.scriptName);

  return (
    <Popup
      isOpen={show}
      isLightDismissEnabled={true}
      onDismiss={() => close()}>
      <View style={[styles.feedbackDialog, {gap: 12}]}>
        <View style={{flexDirection: 'row', marginBottom: 4}}>
          <View style={{backgroundColor: 'gray', borderRadius: 4, marginRight: 4}}>
            <Text>⚙️</Text>
          </View>
          <Text style={{fontWeight: 'bold'}}>OpenAI Settings</Text>
        </View>
        <View>
          <Text>OpenAI API key</Text>
          <TextInput
            secureTextEntry={true}
            style={{flexGrow: 1, minHeight: 32}}
            onChangeText={value => settings.apiKey = value}
            value={settings.apiKey}/>
          <Hyperlink url="https://platform.openai.com/account/api-keys"/>
        </View>
        <View>
          <Text>Script</Text>
          <TextInput
            placeholder="Name of AI script"
            style={{flexGrow: 1, minHeight: 32}}
            onChangeText={value => setScriptName(value)}
            value={scriptName}/>
          <Picker style={{height: 50, width: 200}}>
            <Picker.Item label="Dinosaurs" value="Dinosaurs"/>
            <Picker.Item label="Developer" value="Developer"/>
            <Picker.Item label="None" value=""/>
          </Picker>
        </View>
        <View style={{marginTop: 12, alignSelf: 'flex-end'}}>
          <Button
            title="OK"
            onPress={() => {
              settings.setScriptName(scriptName);
              close();
            }}/>
        </View>
      </View>
    </Popup>
  );
}

export { SettingsContext, SettingsPopup }