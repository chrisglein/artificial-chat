import React, { PropsWithChildren } from 'react';
import {
  ScrollView,
  Text,
  View,
} from 'react-native';
import {Popup} from 'react-native-windows';
import {StylesContext} from './Styles';
import { ButtonV1 as Button } from '@fluentui/react-native';

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
  title: string,
  buttons?: JSX.Element[],
}>;
function DialogFrame({children, show, close, isLightDismissEnabled, title, buttons}: DialogFrameType) {
  const styles = React.useContext(StylesContext);

  const populatedButtons = buttons ?? [
    <Button
      appearance='primary'
      onClick={() => {
        close();
      }}>OK</Button>];
  const buttonList = populatedButtons.map((button, index) => <View key={index}>{button}</View>);

  return (
    <Popup
      isOpen={show}
      isLightDismissEnabled={isLightDismissEnabled ?? true}
      onDismiss={() => close()}
      style={{height: '100%'}}>
      <View style={{justifyContent: 'center', height: '100%'}}>
        <View style={[styles.dialogBackground, {flexShrink: 1}]}>
          <Text
            accessibilityRole="header"
            style={styles.dialogTitle}>
            {title}
          </Text>
          <ScrollView style={{flexShrink: 1}}>
            {children}
          </ScrollView>
          <View style={styles.dialogButtons}>
            {buttonList}
          </View>
        </View>
      </View>
    </Popup>
  )
}

type DialogSectionProps = PropsWithChildren<{
  header: string,
}>;
function DialogSection({children, header}: DialogSectionProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  return (
    <View>
      <Text accessibilityRole="header" style={styles.dialogSectionHeader}>{header}</Text>
      <View style={styles.dialogSection}>
        {children}
      </View>
    </View>
  );
}

export { PopupsContext, DialogFrame, DialogSection }