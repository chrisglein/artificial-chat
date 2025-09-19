import React from 'react';
import {
  Linking,
  Text,
  View,
} from 'react-native';
import { StylesContext } from './Styles';
import { SettingsContext } from './Settings';
import { getRemainingTrialUses } from './TrialMode';

function WelcomeMessage(): JSX.Element {
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
    <View style={[styles.aiSection, { marginBottom: 12 }]}>
      <View style={styles.aiSectionHeader}>
        <Text style={styles.aiSectionTitle}>🤖 AI Assistant</Text>
      </View>
      <View style={{ gap: 12 }}>
        <Text style={styles.text}>
          Welcome to Artificial Chat! 🎉
        </Text>
        
        {!hasApiKey && hasTrialUses && (
          <Text style={styles.text}>
            You have <Text style={{ fontWeight: 'bold', color: '#0078d4' }}>
            {remainingTrialUses} free trial uses
            </Text> available to get started. Additional usage requires an OpenAI API key.
          </Text>
        )}
        
        {!hasApiKey && !hasTrialUses && (
          <Text style={styles.text}>
            To interact with the AI, you'll need to specify an OpenAI API key. 
            When you have generated one, enter it in the settings menu below (⚙️).
          </Text>
        )}
        
        {hasApiKey && (
          <Text style={styles.text}>
            Your OpenAI API key is configured and ready to use. Start chatting below!
          </Text>
        )}

        <Text style={styles.text}>
          Get your API key at{' '}
          <Text 
            style={[styles.text, { color: '#0078d4', textDecorationLine: 'underline' }]}
            onPress={() => Linking.openURL('https://platform.openai.com/account/api-keys')}>
            https://platform.openai.com/account/api-keys
          </Text>
          {' '}and configure it using the settings menu (⚙️) below.
        </Text>

        <Text style={[styles.text, { fontStyle: 'italic' }]}>
          Then we can get chatting! 💬
        </Text>
      </View>
    </View>
  );
}

export { WelcomeMessage };