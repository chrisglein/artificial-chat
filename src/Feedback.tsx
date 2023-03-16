import React from 'react';
import {
  Button,
  Linking,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Popup } from 'react-native-windows';
import { StylesContext } from './Styles';
import VersionInfo from './NativeVersionInfo'

const FeedbackContext = React.createContext<{
  showFeedback : (positive: boolean, response?: string) => void;
}>({showFeedback: () => {}});

type FeedbackPopupProps = {
  show: boolean;
  close: () => void;
  isPositive: boolean;
  response?: string;
}
function FeedbackPopup({show, close, isPositive, response}: FeedbackPopupProps): JSX.Element {
  const styles = React.useContext(StylesContext);
  const [feedbackText, setFeedbackText] = React.useState("");

  return (
    <Popup
      isOpen={show}
      isLightDismissEnabled={true}
      onDismiss={() => close()}>
      <View style={styles.feedbackDialog}>
        <View style={{flexDirection: 'row', marginBottom: 4}}>
          <View style={{backgroundColor: isPositive ? 'green' : 'red', borderRadius: 4, marginRight: 4}}>
            <Text>{isPositive ? "👍" : "👎"}</Text>
          </View>
          <Text style={{fontWeight: 'bold'}}>Provide additional feedback</Text>
        </View>
        <TextInput
          multiline={true}
          placeholder="What would the ideal answer have been?"
          style={{flexGrow: 1, minHeight: 32}}
          onChangeText={value => setFeedbackText(value)}
          value={feedbackText}/>
          {!isPositive && (
            <View>
              <View style={styles.horizontalContainer}>
                <Switch/>
                <Text>This is harmful / unsafe</Text>
              </View>
              <View style={styles.horizontalContainer}>
                <Switch/>
                <Text>This isn't true</Text>
              </View>
              <View style={styles.horizontalContainer}>
                <Switch/>
                <Text>This isn't helpful</Text>
              </View>
            </View>
          )}
        <View style={{marginTop: 12, alignSelf: 'flex-end'}}>
          <Button
            title="Submit feedback"
            onPress={() => {
              const version = VersionInfo?.getConstants().appVersion;
              if (isPositive) {
                Linking.openURL(`https://github.com/chrisglein/artificial-chat/issues/new?template=feedback-positive.yaml&version=${version}&expected=${feedbackText}&response=${response}`);
              } else {
                Linking.openURL(`https://github.com/chrisglein/artificial-chat/issues/new?template=feedback-negative.yaml&version=${version}&expected=${feedbackText}&response=${response}`);
              }              
              close();
            }}/>
        </View>
      </View>
    </Popup>
  );
}

export { FeedbackContext, FeedbackPopup }