import React from 'react';
import {render} from '@testing-library/react-native';
import {WelcomeMessage} from '../src/WelcomeMessage';
import {StylesContext} from '../src/Styles';
import {SettingsContext} from '../src/Settings';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('0')),
  setItem: jest.fn(() => Promise.resolve()),
}));

// Mock Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

// Mock StylesContext and SettingsContext
const mockStyles = {
  aiSection: {},
  aiSectionHeader: {},
  aiSectionTitle: {},
  text: {},
};

const mockSettings = {
  apiKey: undefined,
};

describe('WelcomeMessage', () => {
  it('renders without crashing', () => {
    const {getByText} = render(
      <StylesContext.Provider value={mockStyles}>
        <SettingsContext.Provider value={mockSettings}>
          <WelcomeMessage />
        </SettingsContext.Provider>
      </StylesContext.Provider>
    );
    
    expect(getByText('Welcome to Artificial Chat! 🎉')).toBeTruthy();
  });
});