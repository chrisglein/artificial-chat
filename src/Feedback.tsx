import React from 'react';
import {
  Button,
  Linking,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {DialogFrame} from './Popups';
import { StylesContext } from './Styles';
import VersionInfo from './NativeVersionInfo';

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
  const [thisIsHarmful, setThisIsHarmful] = React.useState(false);
  const [thisIsNotTrue, setThisIsNotTrue] = React.useState(false);
  const [thisIsNotHelpful, setThisIsNotHelpful] = React.useState(false);

  const buttons = [
    <Button
      accessibilityLabel="Submit feedback"
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
    ];

  return (
    <DialogFrame
      show={show}
      close={close}
      titleIcon={isPositive ? "👍" : "👎"}
      titleIconStyle={{backgroundColor: isPositive ? 'green' : 'red'}}
      title="Provide additional feedback"
      buttons={buttons}
      maxHeight={300}>
      <TextInput
        multiline={true}
        placeholder="What would the ideal answer have been?"
        style={{flexGrow: 1, minHeight: 32}}
        onChangeText={value => setFeedbackText(value)}
        value={feedbackText}/>
      {!isPositive && (
        <View>
          <View style={styles.horizontalContainer}>
            <Switch
              accessibilityLabel="This is harmful / unsafe"
              value={thisIsHarmful}
              onValueChange={(value) => setThisIsHarmful(value)}/>
            <Text>This is harmful / unsafe</Text>
          </View>
          <View style={styles.horizontalContainer}>
            <Switch
              accessibilityLabel="This isn't true"
              value={thisIsNotTrue}
              onValueChange={(value) => setThisIsNotTrue(value)}/>
            <Text>This isn't true</Text>
          </View>
          <View style={styles.horizontalContainer}>
            <Switch
              accessibilityLabel="This isn't helpful"
              value={thisIsNotHelpful}
              onValueChange={(value) => setThisIsNotHelpful(value)}/>
            <Text>This isn't helpful</Text>
          </View>
        </View>)}
    </DialogFrame>
  );
}

export { FeedbackContext, FeedbackPopup }