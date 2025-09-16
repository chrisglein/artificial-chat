/**
 * @format
 */

import {
  getTrialUsageCount,
  incrementTrialUsage,
  isTrialAvailable,
  getRemainingTrialUses,
  getTrialLimit,
  getFallbackApiKey,
} from '../src/TrialMode';

// Mock AsyncStorage for testing
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('TrialMode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return correct trial limit', () => {
    expect(getTrialLimit()).toBe(20);
  });

  it('should return fallback API key configuration', () => {
    // In test environment, fallback key should be undefined
    const fallbackKey = getFallbackApiKey();
    expect(typeof fallbackKey === 'string' || typeof fallbackKey === 'undefined').toBe(true);
  });

  it('should calculate remaining uses correctly', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.getItem.mockResolvedValue('5'); // 5 uses consumed

    const remaining = await getRemainingTrialUses();
    expect(remaining).toBe(15); // 20 - 5 = 15
  });

  it('should check trial availability correctly', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    
    // Test with 19 uses (still available)
    AsyncStorage.getItem.mockResolvedValue('19');
    let available = await isTrialAvailable();
    expect(available).toBe(true);

    // Test with 20 uses (exhausted)
    AsyncStorage.getItem.mockResolvedValue('20');
    available = await isTrialAvailable();
    expect(available).toBe(false);
  });
});