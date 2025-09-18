/**
 * Test script to demonstrate trial mode functionality
 * This would be used to verify the trial mode works as expected
 */

const {
  getTrialUsageCount,
  incrementTrialUsage,
  isTrialAvailable,
  getEffectiveApiKey,
  getRemainingTrialUses,
} = require('../src/TrialMode');

// Mock AsyncStorage for testing
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const AsyncStorage = require('@react-native-async-storage/async-storage');

async function demoTrialMode() {
  console.log('=== Trial Mode Demo ===');

  // Simulate fresh user - no usage count yet
  AsyncStorage.getItem.mockResolvedValue(null);
  console.log('Fresh user trial usage:', await getTrialUsageCount()); // Should be 0
  console.log('Remaining uses:', await getRemainingTrialUses()); // Should be 20

  // Simulate API call usage
  AsyncStorage.getItem.mockResolvedValue('5');
  AsyncStorage.setItem.mockResolvedValue(undefined);
  console.log('After 5 uses, incrementing...', await incrementTrialUsage()); // Should be 6

  // Simulate near trial expiration
  AsyncStorage.getItem.mockResolvedValue('19');
  console.log('Near expiration remaining:', await getRemainingTrialUses()); // Should be 1

  // Simulate trial exhausted
  AsyncStorage.getItem.mockResolvedValue('20');
  console.log('Trial exhausted available:', await isTrialAvailable()); // Should be false

  // Test with user API key
  console.log('With user key:', await getEffectiveApiKey('sk-user123')); // Should return user key

  console.log('Demo complete!');
}

// This would be run during development to verify functionality
module.exports = { demoTrialMode };