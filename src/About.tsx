import React from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';
import {Popup} from 'react-native-windows';
import {StylesContext} from './Styles';

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
            <Text>❔</Text>
          </View>
          <Text style={{fontWeight: 'bold'}}>About</Text>
        </View>
        <View style={{marginTop: 12, alignSelf: 'flex-end'}}>
          <Button
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