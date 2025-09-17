import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  Button,
  Modal,
  Text,
  View,
} from 'react-native';
import {StylesContext} from './Styles';
import {ContentDialog} from 'react-native-content-dialog';

type PopupsContextType = {
  showAbout: boolean;
  setShowAbout: (value: boolean) => void;
  showSettings: boolean;
  setShowSettings: (value: boolean) => void;
};
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
  maxWidth?: number,
  maxHeight?: number,
}>;
function DialogFrame({children, show, close, isLightDismissEnabled, titleIcon, titleIconStyle, title, buttons, maxWidth, maxHeight}: DialogFrameType) {
  const styles = React.useContext(StylesContext);

  const populatedButtons = buttons ?? [<Button
    accessibilityLabel="OK"
    title="OK"
    onPress={() => {
      close();
    }}/>];
  const buttonList = populatedButtons.map((button, index) => <View key={index}>{button}</View>);

  // TODO: isLightDismissEnabled is not implemented
  // NOTE: presence of maxWidth and maxHeight is a workaround for this bug: https://github.com/microsoft/react-native-windows/issues/14805

  return (
    <Modal
      visible={show}
      onRequestClose={() => close()}>
      <View style={{maxWidth: maxWidth, maxHeight: maxHeight}}>
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
      </View>
    </Modal>
  );
}

type DialogSectionProps = PropsWithChildren<{
  header: string;
}>;
function DialogSection({children, header}: DialogSectionProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  return (
    <View>
      <Text accessibilityRole="header" style={styles.dialogSectionHeader}>
        {header}
      </Text>
      <View style={styles.dialogSection}>{children}</View>
    </View>
  );
}

export { PopupsContext, ContentDialog, DialogSection };
