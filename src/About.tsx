import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import {
  FluentButton as Button,
  Link
} from './FluentControls';
import {
  ContentDialog,
} from './Popups';
import {StylesContext} from './Styles';
import VersionInfo from './NativeVersionInfo';
import Clipboard from '@react-native-clipboard/clipboard';

type AboutPopupProps = {
  show: boolean;
  close: () => void;
}
function AboutPopup({show, close}: AboutPopupProps): JSX.Element {
  const styles = React.useContext(StylesContext);

  const version = VersionInfo.getConstants().appVersion;
  const copyVersion = () => {
    Clipboard.setString(version)
  }

  return (
    <ContentDialog
      show={show}
      close={close}
      title="About"
      defaultButtonIndex={0}
      maxWidth={300}
      maxHeight={240}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
        <Text>Version: <Text style={{fontWeight: 'bold'}}>{version}</Text></Text>
        <Button
          appearance='subtle'
          accessibilityLabel='Copy version'
          icon={{ fontSource: { fontFamily: 'Segoe MDL2 Assets', codepoint: 0xE8C8 } }}
          iconOnly={true}
          tooltip='Copy version'
          onClick={copyVersion}></Button>
      </View>
      <View style={{flexDirection: 'row', gap: 4}}>
        <Text>Source code:</Text>
        <Link
          content='GitHub'
          url='https://github.com/chrisglein/artificial-chat/'/>
      </View>
      <View style={{flexDirection: 'row', gap: 4}}>
        <Text>React Native: </Text>
        <Link
          content='0.79.0'
          url='https://github.com/microsoft/react-native-windows/releases/tag/react-native-windows_v0.79.0/'/>
      </View>
    </ContentDialog>
  );
}

export { AboutPopup }