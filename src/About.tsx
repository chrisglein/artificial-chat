import React from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';
import {Hyperlink} from './Controls';
import {
  DialogFrame,
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
    <DialogFrame
      show={show}
      close={close}
      title="About">
      <Text>Version: <Text style={{fontWeight: 'bold'}}>{VersionInfo.getConstants().appVersion}</Text></Text>
      <View style={{flexDirection: 'row', gap: 4}}>
        <Text>Source code:</Text>
        <Hyperlink
          text='GitHub'
          url='https://github.com/chrisglein/artificial-chat/'/>
      </View>
    </DialogFrame>
  );
}

export { AboutPopup }