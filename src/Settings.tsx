import React from 'react';
import {Text, View} from 'react-native';
import {ContentDialog, DialogSection} from './Popups';
import {StylesContext} from './Styles';
import {Picker} from './Picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FluentTextInput } from './Controls';
import {
  Link,
  FluentCheckbox as Checkbox,
} from './FluentControls';
import { GetVoices, SetVoice } from './Speech';
import { getRemainingTrialUses, MAX_TRIAL_USES } from './TrialMode';

const settingsKey = 'settings';

// App-wide settings that can be modified from a menu, some of which are saved between app sessions
type SettingsContextType = {
  apiKey?: string;
  setApiKey: (value?: string) => void;
  detectImageIntent: boolean;
  setDetectImageIntent: (value: boolean) => void;
  imageResponseCount: number;
  setImageResponseCount: (value: number) => void;
  imageSize: number;
  setImageSize: (value: number) => void;
  aiEndpoint: string;
  setAiEndpoint: (value: string) => void;
  chatModel: string;
  setChatModel: (value: string) => void;
  readToMeVoice: string;
  setReadToMeVoice: (value: string) => void;
};
const SettingsContext = React.createContext<SettingsContextType>({
  setApiKey: () => {},
  detectImageIntent: false,
  setDetectImageIntent: () => {},
  imageResponseCount: 1,
  setImageResponseCount: () => {},
  imageSize: 256,
  setImageSize: () => {},
  aiEndpoint: '',
  setAiEndpoint: () => {},
  chatModel: '',
  setChatModel: () => {},
  readToMeVoice: '',
  setReadToMeVoice: () => {},
});

// Settings that are saved between app sessions
type SettingsData = {
  apiKey?: string;
  imageSize?: number;
  readToMeVoice?: string;
};

// Read settings from app storage
const SaveSettingsData = async (value: SettingsData) => {
  console.debug('Saving settings data...');
  try {
    const valueAsString = JSON.stringify(value);
    await AsyncStorage.setItem(settingsKey, valueAsString);
    console.debug('Done saving settings data');
  } catch (e) {
    console.error(e);
  }
};

// Write settings to app storage
const LoadSettingsData = async () => {
  console.debug('Loading settings data...');
  let valueToSave: SettingsData = {};
  try {
    const valueAsString = await AsyncStorage.getItem(settingsKey);
    if (valueAsString != null) {
      const value = JSON.parse(valueAsString);

      if (value.hasOwnProperty('apiKey')) { valueToSave.apiKey = value.apiKey; }
      if (value.hasOwnProperty('imageSize')) { valueToSave.imageSize = parseInt(value.imageSize, 10); }
      if (value.hasOwnProperty('readToMeVoice')) { valueToSave.readToMeVoice = value.readToMeVoice; }
    }
  } catch (e) {
    console.error(e);
  }
  return valueToSave;
};

type SettingsPopupProps = {
  show: boolean;
  close: () => void;
};
function SettingsPopup({show, close}: SettingsPopupProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const settings = React.useContext(SettingsContext);
  const [aiEndpoint, setAiEndpoint] = React.useState<string>(
    settings.aiEndpoint,
  );
  const [chatModel, setChatModel] = React.useState<string>(settings.chatModel);
  const [apiKey, setApiKey] = React.useState<string | undefined>(
    settings.apiKey,
  );
  const [saveApiKey, setSaveApiKey] = React.useState<boolean>(false);
  const [detectImageIntent, setDetectImageIntent] = React.useState<boolean>(settings.detectImageIntent);
  const [imageResponseCount, setImageResponseCount] = React.useState<number>(settings.imageResponseCount);
  const [imageSize, setImageSize] = React.useState<number>(settings.imageSize);
  const [readToMeVoice, setReadToMeVoice] = React.useState<string>(
    settings.readToMeVoice,
  );
  // Trial mode state
  const [remainingTrialUses, setRemainingTrialUses] = React.useState<number>(0);

  // Load trial status
  const loadTrialStatus = React.useCallback(async () => {
    try {
      const remaining = await getRemainingTrialUses();
      setRemainingTrialUses(remaining);
    } catch (error) {
      console.error('Failed to load trial status:', error);
    }
  }, []);

  // It may seem weird to do this when the UI loads, not the app, but it's okay
  // because this component is loaded when the app starts but isn't shown. And
  // this popup needs to directly know when the settings change (which won't
  // happen directly if you just consume settings.apiKey inside the component.
  React.useEffect(() => {
    const load = async () => {
      let value = await LoadSettingsData();

      setApiKey(value.apiKey);
      settings.setApiKey(value.apiKey);

      let resolvedImageSize = value.imageSize ?? 256;
      setImageSize(resolvedImageSize);
      settings.setImageSize(resolvedImageSize);

      let resolvedReadToMeVoice = value.readToMeVoice ?? '';
      settings.setReadToMeVoice(resolvedReadToMeVoice);
      SetVoice(resolvedReadToMeVoice);

      // If an API key was set, continue to remember it
      setSaveApiKey(value.apiKey !== undefined);

      // Load trial status
      await loadTrialStatus();
    };
    load();
  }, [loadTrialStatus, settings]);

  // Reload trial status when API key changes
  React.useEffect(() => {
    loadTrialStatus();
  }, [apiKey, loadTrialStatus]);

  const save = () => {
    settings.setAiEndpoint(aiEndpoint);
    settings.setChatModel(chatModel);
    settings.setApiKey(apiKey);
    settings.setDetectImageIntent(detectImageIntent);
    settings.setImageResponseCount(imageResponseCount);
    settings.setImageSize(imageSize);
    settings.setReadToMeVoice(readToMeVoice);

    close();

    // Need to apply to the speech engine
    SetVoice(readToMeVoice);

    SaveSettingsData({
      apiKey: saveApiKey ? apiKey : undefined,
      imageSize: imageSize,
      readToMeVoice: readToMeVoice,
    });
  };

  const cancel = () => {
    setAiEndpoint(settings.aiEndpoint);
    setChatModel(settings.chatModel);
    setApiKey(settings.apiKey);
    setDetectImageIntent(settings.detectImageIntent);
    setImageResponseCount(settings.imageResponseCount);
    setImageSize(settings.imageSize);
    setReadToMeVoice(settings.readToMeVoice);
    close();
  };

  const buttons = [
    {
      title: 'OK',
      onPress: () => {
        save();
      },
    },
    {
      title: 'Cancel',
      onPress: () => {
        cancel();
      },
    },
  ];

  return (
    <ContentDialog
      show={show}
      close={() => {cancel();}}
      isLightDismissEnabled={false}
      title="OpenAI Settings"
      buttons={buttons}
      defaultButtonIndex={0}
      maxWidth={400}
      maxHeight={800}>
      <View style={styles.dialogSectionsContainer}>
        <DialogSection header="Chat">
          <Text style={styles.text}>AI Endpoint</Text>
          <FluentTextInput
            accessibilityLabel="AI Endpoint"
            style={{flexGrow: 1, minHeight: 32}}
            value={aiEndpoint}
            onChangeText={value => setAiEndpoint(value)}
          />
          <Text style={styles.text}>Chat Model</Text>
          <Picker
            accessibilityLabel="Chat Model"
            selectedValue={chatModel}
            onValueChange={value => setChatModel(value)}>
            {['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'].map(value => <Picker.Item label={value} value={value} key={value}/>)}
          </Picker>
          {/* Trial mode status */}
          {remainingTrialUses > 0 && !apiKey && (
            <View style={styles.trialModeActive}>
              <Text style={[styles.trialModeText, {color: '#0078d4'}]}>
                🎉 Trial Mode: {remainingTrialUses} of {MAX_TRIAL_USES} free uses remaining
              </Text>
            </View>
          )}

          {remainingTrialUses === 0 && !apiKey && (
            <View style={styles.trialModeExpired}>
              <Text style={[styles.trialModeText, {color: '#d83b01'}]}>
                Trial expired. Please add your API key below to continue.
              </Text>
            </View>
          )}

          <Text style={styles.text}>API key</Text>
          <FluentTextInput
            accessibilityLabel="API key"
            secureTextEntry={true}
            style={{flexGrow: 1, minHeight: 32}}
            onChangeText={value => setApiKey(value)}
            value={apiKey}/>
            <Checkbox
              label="Remember this"
              size="large"
              checked={saveApiKey}
              onChange={(event, value) => setSaveApiKey(value)}/>
          <Link
            content="https://platform.openai.com/account/api-keys"
            url="https://platform.openai.com/account/api-keys"
          />
        </DialogSection>
        <DialogSection header="Image Generation">
          <Checkbox
            label="Infer image intent from prompt"
            size="large"
            checked={detectImageIntent}
            onChange={(event, value) => setDetectImageIntent(value)}
          />
          <Text style={styles.text}>Image Count</Text>
          <Picker
            accessibilityLabel="Image Count"
            selectedValue={imageResponseCount}
            onValueChange={value =>
              setImageResponseCount(
                typeof value === 'number' ? value : parseInt(value, 10),
              )
            }>
            {[1, 2, 3, 4].map(number => (
              <Picker.Item
                label={number.toString()}
                value={number}
                key={number}
              />
            ))}
          </Picker>
          <Text style={styles.text}>Image Size</Text>
          <Picker
            accessibilityLabel="Image Size"
            selectedValue={imageSize}
            onValueChange={value =>
              setImageSize(typeof value === 'number' ? value : parseInt(value, 10))
            }>
            {[256, 512, 1024].map(size => (
              <Picker.Item label={size.toString()} value={size} key={size} />
            ))}
          </Picker>
        </DialogSection>
        <DialogSection header="Read to Me">
          <Text style={styles.text}>Read to me</Text>
          <Picker
            accessibilityLabel="Read to me"
            selectedValue={readToMeVoice}
            onValueChange={value => setReadToMeVoice(value)}>
            {GetVoices().map(voice => (
              <Picker.Item
                label={voice.displayName}
                value={voice.id}
                key={voice.id}
              />
            ))}
            <Picker.Item label="None" value="" />
          </Picker>
        </DialogSection>
      </View>
    </ContentDialog>
  );
}

export { SettingsContext, SettingsPopup };
