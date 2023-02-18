import React from 'react';

type StylesType = {
  appContent: any;
  sectionContainer: any;
  humanSection: any;
  aiSection: any;
  sectionTitle: any;
  highlight: any;
  horizontalContainer: any;
  dalleImage: any;
  inlineCard: any;
  feedbackDialog: any;
  codeBlockTitle: any;
  codeBlockTitleText: any;
  codeBlockContent: any;
}
const StylesContext = React.createContext<StylesType>({});

export { StylesContext };