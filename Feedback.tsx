import React from 'react';

type FeedbackType = {
  showFeedback : (positive: boolean) => void;
}

const FeedbackContext = React.createContext<FeedbackType>({showFeedback: () => {}});

export { FeedbackContext }