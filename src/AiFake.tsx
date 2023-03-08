import React from 'react';
import type {PropsWithChildren} from 'react';
import { AiSection } from './AiResponse';

import { ChatScrollContext } from './Chat';
import { SettingsContext } from './Settings';

function AiSectionWithFakeResponse({children}: PropsWithChildren): JSX.Element {
  const settingsContext = React.useContext(SettingsContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const chatScroll = React.useContext(ChatScrollContext);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      chatScroll.scrollToEnd();
    }, settingsContext.delayForArtificialResponse ?? 0);
  });

  return (
    <AiSection isLoading={isLoading}>
      {!isLoading && children}
    </AiSection>
  )
}

export { AiSectionWithFakeResponse }