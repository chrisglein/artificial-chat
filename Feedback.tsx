import React from 'react';
import {
  Button,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Popup,
} from 'react-native-windows';
import {
  StylesContext,
} from './Styles';

type FeedbackType = {
  showFeedback : (positive: boolean) => void;
}

const FeedbackContext = React.createContext<FeedbackType>({showFeedback: () => {}});

type FeedbackPopupProps = {
  show: boolean;
  close: () => void;
  isPositive: boolean;
}
function FeedbackPopup({show, close, isPositive}: FeedbackPopupProps): JSX.Element {
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
              console.log(isPositive ? "like" : "dislike");
              console.log(feedbackText);
              close();
            }}/>
        </View>
      </View>
    </Popup>
  );
}

export { FeedbackContext, FeedbackPopup }