import React from 'react';

type PopupsContextType = {
    showAbout: boolean,
    setShowAbout: (value: boolean) => void,
    showSettings: boolean,
    setShowSettings: (value: boolean) => void,
  }
const PopupsContext = React.createContext<PopupsContextType>({
  showAbout: false,
  setShowAbout: () => {},
  showSettings: false,
  setShowSettings: () => {},
});

export { PopupsContext }