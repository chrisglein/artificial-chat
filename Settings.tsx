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
import {ChatScriptNames} from './ChatScript';

type SettingsType = {
  apiKey?: string,
  setApiKey: (value: string) => void,
  scriptName?: string,
  setScriptName: (value: string) => void,
  delayForArtificialResponse?: number,
  setDelayForArtificialResponse: (value: number) => void,
}
  
const SettingsContext = React.createContext<SettingsType>({});

type SettingsPopupProps = {
  show: boolean;
  close: () => void;
}
function SettingsPopup({show, close}: SettingsPopupProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const settings = React.useContext(SettingsContext);
  const [apiKey, setApiKey] = React.useState<string>(settings.apiKey ?? "");
  const [scriptName, setScriptName] = React.useState<string>(settings.scriptName ?? "");
  const [delayForArtificialResponse, setDelayForArtificialResponse] = React.useState<number>(settings.delayForArtificialResponse ?? 0);

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
            onChangeText={value => setApiKey(value)}
            value={apiKey}/>
          <Hyperlink url="https://platform.openai.com/account/api-keys"/>
        </View>
        <View>
          <Text>Script</Text>
          <Picker
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
            keyboardType="numeric"
            style={{flexGrow: 1, minHeight: 32}}
            onChangeText={value => setDelayForArtificialResponse(parseInt(value))}
            value={delayForArtificialResponse.toString()}/>
        </View>
        <View style={{marginTop: 12, alignSelf: 'flex-end'}}>
          <Button
            title="OK"
            onPress={() => {
              settings.setApiKey(apiKey);
              settings.setScriptName(scriptName);
              settings.setDelayForArtificialResponse(delayForArtificialResponse);
              close();
            }}/>
        </View>
      </View>
    </Popup>
  );
}

export { SettingsContext, SettingsPopup }