import React from 'react';
import {
  Text,
  View,
  Pressable,
} from 'react-native';
import { FlyoutMenu } from './Controls';
import { Link } from './FluentControls';
import { StylesContext } from './Styles';
import { SettingsContext } from './Settings';
import { getRemainingTrialUses } from './TrialMode';

function WelcomeMessage(): JSX.Element {
  const deleteWelcomeMessage = () => { /* No-op */ };
  const menuItems = [];
  menuItems.push(
    {title: 'Don\'t show this again', icon: 0xE74D, onPress: deleteWelcomeMessage}
  );

  const styles = React.useContext(StylesContext);

  return (
    <View
      accessibilityRole="none"
      accessibilityLabel="Welcome message"
      style={[styles.sectionContainer, styles.AiSection]}>
      <View style={{flexDirection: 'row'}}>
        <Text
          accessibilityRole="header"
          style={[styles.sectionTitle, {flexGrow: 1}]}>
          Welcome
        </Text>
        <FlyoutMenu items={menuItems} maxWidth={300} maxHeight={400}/>
      </View>
      <View style={{gap: 8}}>
        <WelcomeMessageContent />
      </View>
    </View>
  );
}

function WelcomeMessageContent(): JSX.Element {
  const styles = React.useContext(StylesContext);
  const settings = React.useContext(SettingsContext);
  const [remainingTrialUses, setRemainingTrialUses] = React.useState<number>(0);

  React.useEffect(() => {
    const loadTrialStatus = async () => {
      try {
        const remaining = await getRemainingTrialUses();
        setRemainingTrialUses(remaining);
      } catch (error) {
        console.error('Failed to load trial status:', error);
      }
    };
    loadTrialStatus();
  }, []);

  const hasApiKey = !!settings.apiKey;
  const hasTrialUses = remainingTrialUses > 0;

  return (
    <View>
      <View style={{ gap: 12 }}>
        <Text style={styles.text}>
          Welcome to Artificial Chat! A program where you can interact with AI models like GPT-4 and GPT-3.5, both with generative text and images.
        </Text>
        
        {!hasApiKey && hasTrialUses && (
          <View>
            <Text style={styles.text}>
              You can get started right away with your <Text style={[styles.text, { fontWeight: 'bold', color: '#0078d4' }]}>
              {remainingTrialUses} free trial prompts
              </Text>. Additional usage will require an OpenAI API key.
            </Text>
            <Link url='https://platform.openai.com/account/api-keys' content='https://platform.openai.com/account/api-keys'/>
            <Text style={styles.text}>
              When you have generated a key, enter it in the settings menu below (...).
            </Text>
          </View>
        )}
        
        {!hasApiKey && !hasTrialUses && (
          <View>
            <Text style={styles.text}>
              Your trial has expired. To continue interacting with the app you'll need to specify an OpenAI API key.
            </Text>
            <Link url='https://platform.openai.com/account/api-keys' content='https://platform.openai.com/account/api-keys'/>
            <Text style={styles.text}>
              When you have generated a key, enter it in the settings menu below (...).
            </Text>
          </View>
        )}
        
        {hasApiKey && (
          <Text style={styles.text}>
            Your OpenAI API key is configured and ready to use. Start chatting below!
          </Text>
        )}
      </View>
    </View>
  );
}

export { WelcomeMessage };