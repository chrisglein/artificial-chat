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
  isLightDismissEnabled?: boolean,
  titleIcon: string,
  titleIconStyle?: any,
  title: string,
  buttons?: JSX.Element[],
}>;
function DialogFrame({children, show, close, isLightDismissEnabled, titleIcon, titleIconStyle, title, buttons}: DialogFrameType) {
  const styles = React.useContext(StylesContext);

  const populatedButtons = buttons ?? [<Button
    accessibilityLabel='OK'
    title="OK"
    onPress={() => {
      close();
    }}/>];
  const buttonList = populatedButtons.map((button, index) => <View key={index}>{button}</View>);

  return (
    <Popup
      isOpen={show}
      isLightDismissEnabled={isLightDismissEnabled ?? true}
      onDismiss={() => close()}>
      <View style={[styles.dialogBackground, {gap: 12}]}>
        <View style={{flexDirection: 'row', marginBottom: 4, gap: 4}}>
          <View style={[styles.dialogTitleIcon, titleIconStyle]}>
            <Text accessible={false}>{titleIcon}</Text>
          </View>
          <Text
            accessibilityRole="header"
            style={styles.dialogTitle}>
            {title}
          </Text>
        </View>
        {children}
        <View style={styles.dialogButtons}>
          {buttonList}
        </View>
      </View>
    </Popup>
  )
}

export { PopupsContext, DialogFrame }