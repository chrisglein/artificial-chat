import AsyncStorage from '@react-native-async-storage/async-storage';

const TRIAL_USAGE_KEY = 'trialUsageCount';
const MAX_TRIAL_USES = 20;

// Get the fallback API key for trial mode
// This will be replaced during build process with actual key
const getTrialApiKey = (): string | undefined => {
  // This constant will be replaced during build
  const TRIAL_API_KEY = undefined; // BUILD_REPLACE_TRIAL_KEY
  return TRIAL_API_KEY;
};

// Get current trial usage count
export const getTrialUsageCount = async (): Promise<number> => {
  try {
    const countString = await AsyncStorage.getItem(TRIAL_USAGE_KEY);
    return countString ? parseInt(countString, 10) : 0;
  } catch (error) {
    console.error('Failed to get trial usage count:', error);
    return 0;
  }
};

// Increment trial usage count
export const incrementTrialUsage = async (): Promise<number> => {
  try {
    const currentCount = await getTrialUsageCount();
    const newCount = currentCount + 1;
    await AsyncStorage.setItem(TRIAL_USAGE_KEY, newCount.toString());
    return newCount;
  } catch (error) {
    console.error('Failed to increment trial usage:', error);
    return MAX_TRIAL_USES; // Return max to prevent further usage
  }
};

// Check if trial mode is available
export const isTrialAvailable = async (): Promise<boolean> => {
  const trialKey = getTrialApiKey();
  if (!trialKey) {
    return false;
  }

  const usageCount = await getTrialUsageCount();
  return usageCount < MAX_TRIAL_USES;
};

// Get the effective API key (user's key or trial key if available)
export const getEffectiveApiKey = async (userApiKey?: string): Promise<string | undefined> => {
  if (userApiKey) {
    return userApiKey;
  }

  const trialAvailable = await isTrialAvailable();
  if (trialAvailable) {
    return getTrialApiKey();
  }

  return undefined;
};

// Get remaining trial uses
export const getRemainingTrialUses = async (): Promise<number> => {
  const usageCount = await getTrialUsageCount();
  return Math.max(0, MAX_TRIAL_USES - usageCount);
};

// Check if we're currently using trial mode
export const isUsingTrialMode = async (userApiKey?: string): Promise<boolean> => {
  if (userApiKey) {
    return false;
  }

  return await isTrialAvailable();
};

export { MAX_TRIAL_USES };
