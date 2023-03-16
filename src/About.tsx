import React from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';
import {Hyperlink} from './Controls';
import {Popup} from 'react-native-windows';
import {StylesContext} from './Styles';
import VersionInfo from './NativeVersionInfo'

type AboutPopupProps = {
  show: boolean;
  close: () => void;
}
function AboutPopup({show, close}: AboutPopupProps): JSX.Element {
  const styles = React.useContext(StylesContext);

  return (
    <Popup
      isOpen={show}
      isLightDismissEnabled={true}
      onDismiss={() => close()}>
      <View style={[styles.feedbackDialog, {gap: 12}]}>
        <View style={{flexDirection: 'row', marginBottom: 4}}>
          <View style={{backgroundColor: 'gray', borderRadius: 4, marginRight: 4}}>
            <Text accessible={false}>❔</Text>
          </View>
          <Text
            accessibilityRole="header"
            style={{fontWeight: 'bold'}}>
              About
          </Text>
        </View>
        <Text>{VersionInfo.getConstants().appVersion}</Text>
        <Hyperlink url='https://github.com/chrisglein/artificial-chat/'/>
        <View style={{marginTop: 12, alignSelf: 'flex-end'}}>
          <Button
            accessibilityLabel='OK'
            title="OK"
            onPress={() => {
              close();
            }}/>
        </View>
      </View>
    </Popup>
  );
}

export { AboutPopup }