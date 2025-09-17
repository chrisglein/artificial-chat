import React from 'react';
import type {PropsWithChildren} from 'react';
import { AiSection } from './AiResponse';

import { ChatScrollContext } from './Chat';
import { SettingsContext } from './Settings';

type AiSectionWithFakeResponseProps = PropsWithChildren<{
  id: number;
}>;
function AiSectionWithFakeResponse({children, id}: AiSectionWithFakeResponseProps): JSX.Element {
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
    <AiSection id={id} isLoading={isLoading}>
      {!isLoading && children}
    </AiSection>
  );
}

export { AiSectionWithFakeResponse };
