import React, { PropsWithChildren } from 'react';
import {
  Button,
  Text,
  View,
} from 'react-native';
import {Popup} from 'react-native-windows';
import {StylesContext} from './Styles';

type PopupsContextType = {
    showAbout: boolean,
    setShowAbout: (value: boolean) => void,
    showSettings: boolean,
    setShowSettings: (value: boolean) => void,
  }
const PopupsContext = React.createContext<PopupsContextType>({
  showAbout: false,
  setShowAbout: () => {},
  showSettings: false,
  setShowSettings: () => {},
});

type DialogFrameType = PropsWithChildren<{
  show: boolean,
  close: () => void;
  titleIcon: string,
  title: string,
}>;
function DialogFrame({children, show, close, title, titleIcon}: DialogFrameType) {
  const styles = React.useContext(StylesContext);

  return (
    <Popup
      isOpen={show}
      isLightDismissEnabled={true}
      onDismiss={() => close()}>
      <View style={[styles.feedbackDialog, {gap: 12}]}>
        <View style={{flexDirection: 'row', marginBottom: 4}}>
          <View style={styles.dialogTitleIcon}>
            <Text accessible={false}>{titleIcon}</Text>
          </View>
          <Text
            accessibilityRole="header"
            style={styles.dialogTitle}>
            {title}
          </Text>
        </View>
        {children}
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
  )
}

export { PopupsContext, DialogFrame }