/**
 * @format
 */

// Mock AsyncStorage before importing TrialMode
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getTrialUsageCount,
  incrementTrialUsage,
  isTrialAvailable,
  getEffectiveApiKey,
  getRemainingTrialUses,
  isUsingTrialMode,
  MAX_TRIAL_USES,
} from '../src/TrialMode';

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('TrialMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initial trial usage count should be 0', async () => {
    mockAsyncStorage.getItem.mockResolvedValue(null);
    const count = await getTrialUsageCount();
    expect(count).toBe(0);
  });

  test('should increment trial usage count', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('5');
    mockAsyncStorage.setItem.mockResolvedValue(undefined);

    const newCount = await incrementTrialUsage();
    expect(newCount).toBe(6);
    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('trialUsageCount', '6');
  });

  test('should calculate remaining trial uses correctly', async () => {
    mockAsyncStorage.getItem.mockResolvedValue('15');
    const remaining = await getRemainingTrialUses();
    expect(remaining).toBe(5);
  });

  test('should return user API key when provided', async () => {
    const userKey = 'sk-user123';
    const effectiveKey = await getEffectiveApiKey(userKey);
    expect(effectiveKey).toBe(userKey);
  });

  test('should not be using trial mode when user has API key', async () => {
    const userKey = 'sk-user123';
    const usingTrial = await isUsingTrialMode(userKey);
    expect(usingTrial).toBe(false);
  });

  test('trial should not be available when usage exceeds limit', async () => {
    mockAsyncStorage.getItem.mockResolvedValue(MAX_TRIAL_USES.toString());
    const available = await isTrialAvailable();
    expect(available).toBe(false);
  });

  test('should handle AsyncStorage errors gracefully', async () => {
    mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));
    const count = await getTrialUsageCount();
    expect(count).toBe(0);

    // When there's an error in incrementTrialUsage, it should return the max to prevent further usage
    mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));
    const newCount = await incrementTrialUsage();
    expect(newCount).toBe(MAX_TRIAL_USES);
  });
});
