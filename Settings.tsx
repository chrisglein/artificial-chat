import React from 'react';
import {
  Button,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Popup,
} from 'react-native-windows';
import {
  Hyperlink,
} from './Controls';
import {
  StylesContext,
} from './Styles';

type SettingsType = {
  apiKey?: string;
}
  
const SettingsContext = React.createContext<SettingsType>({});

type SettingsPopupProps = {
  show: boolean;
  close: () => void;
}
function SettingsPopup({show, close}: SettingsPopupProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const settings = React.useContext(SettingsContext);

  return (
    <Popup
      isOpen={show}
      isLightDismissEnabled={true}
      onDismiss={() => close()}>
      <View style={styles.feedbackDialog}>
        <View style={{flexDirection: 'row', marginBottom: 4}}>
          <View style={{backgroundColor: 'gray', borderRadius: 4, marginRight: 4}}>
            <Text>⚙️</Text>
          </View>
          <Text>OpenAI Settings</Text>
        </View>
        <TextInput
          secureTextEntry={true}
          placeholder="Your API key"
          style={{flexGrow: 1, minHeight: 32}}
          onChangeText={value => settings.apiKey = value}
          value={settings.apiKey}/>
        <Hyperlink url="https://platform.openai.com/account/api-keys"/>
        <View style={{marginTop: 12, alignSelf: 'flex-end'}}>
          <Button
            title="OK"
            onPress={() => close()}/>
        </View>
      </View>
    </Popup>
  );
}

export { SettingsContext, SettingsPopup }