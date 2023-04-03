import React, { PropsWithChildren } from 'react';
import {
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
      onDismiss={() => close()}>
      <View style={[styles.dialogBackground, {gap: 12}]}>
        <Text
          accessibilityRole="header"
          style={styles.dialogTitle}>
          {title}
        </Text>
        {children}
        <View style={styles.dialogButtons}>
          {buttonList}
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