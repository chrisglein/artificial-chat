import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  Text,
  View,
} from 'react-native';
import {StylesContext} from './Styles';
import {ContentDialog} from 'react-native-content-dialog';

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

export { PopupsContext, ContentDialog, DialogSection }