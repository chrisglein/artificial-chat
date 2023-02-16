import React from 'react';

type SettingsType = {
  apiKey?: string;
}
  
const SettingsContext = React.createContext<SettingsType>({});

export { SettingsContext }