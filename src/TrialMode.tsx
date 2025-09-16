import AsyncStorage from '@react-native-async-storage/async-storage';

const TRIAL_USAGE_KEY = 'trial_usage_count';
const TRIAL_LIMIT = 20;

// Read trial usage count from storage
export const getTrialUsageCount = async (): Promise<number> => {
  try {
    const countStr = await AsyncStorage.getItem(TRIAL_USAGE_KEY);
    return countStr ? parseInt(countStr, 10) : 0;
  } catch (error) {
    console.error('Error reading trial usage count:', error);
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
    console.error('Error incrementing trial usage count:', error);
    return 0;
  }
};

// Check if trial is still available
export const isTrialAvailable = async (): Promise<boolean> => {
  const usageCount = await getTrialUsageCount();
  return usageCount < TRIAL_LIMIT;
};

// Get remaining trial uses
export const getRemainingTrialUses = async (): Promise<number> => {
  const usageCount = await getTrialUsageCount();
  return Math.max(0, TRIAL_LIMIT - usageCount);
};

// Get trial limit constant
export const getTrialLimit = (): number => {
  return TRIAL_LIMIT;
};

// Get fallback API key from build-time configuration
// This will be filled in at build time, not checked into the repo
export const getFallbackApiKey = (): string | undefined => {
  // During development, developers can temporarily put a key here for testing
  // but it should not be committed to the repo
  const BuildTimeFallbackKey = undefined; // This will be set during build process
  
  // Allow env variable override for development/testing
  if (
    typeof process !== 'undefined' &&
    process.env &&
    process.env.REACT_NATIVE_FALLBACK_API_KEY
  ) {
    return process.env.REACT_NATIVE_FALLBACK_API_KEY;
  }

  return BuildTimeFallbackKey;
};
