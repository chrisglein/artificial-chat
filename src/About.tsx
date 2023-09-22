import React from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';
import {Hyperlink} from './Controls';
import {
  ContentDialog,
} from './Popups';
import {StylesContext} from './Styles';
import VersionInfo from './NativeVersionInfo'

type AboutPopupProps = {
  show: boolean;
  close: () => void;
}
function AboutPopup({show, close}: AboutPopupProps): JSX.Element {
  const styles = React.useContext(StylesContext);

  return (
    <ContentDialog
      show={show}
      close={close}
      title="About"
      defaultButtonIndex={0}>
      <Text>Version: <Text style={{fontWeight: 'bold'}}>{VersionInfo.getConstants().appVersion}</Text></Text>
      <View style={{flexDirection: 'row', gap: 4}}>
        <Text>Source code:</Text>
        <Hyperlink
          text='GitHub'
          url='https://github.com/chrisglein/artificial-chat/'/>
      </View>
    </ContentDialog>
  );
}

export { AboutPopup }