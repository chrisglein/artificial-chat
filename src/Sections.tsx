import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  ActivityIndicator,
  Button,
  Pressable,
  Image,
  Text,
  View,
} from 'react-native';
import {
  OpenAiApi,
  CallOpenAi,
} from './OpenAI';
import {
  HoverButton,
  CodeBlock
} from './Controls';
import { ChatElement, ChatSource, ChatContent, ChatScrollContext, ChatHistoryContext } from './Chat';
import { StylesContext } from './Styles';
import { FeedbackContext } from './Feedback';
import { SettingsContext } from './Settings';

type HumanSectionProps = PropsWithChildren<{
  disableEdit?: boolean;
  disableCopy?: boolean;
  contentShownOnHover?: JSX.Element;
}>;
function HumanSection({children, disableEdit, disableCopy, contentShownOnHover}: HumanSectionProps): JSX.Element {
  const [hovering, setHovering] = React.useState(false);
  const styles = React.useContext(StylesContext);

  return (
    <Pressable
      style={[styles.sectionContainer, styles.humanSection]}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}>
      <View style={{flexDirection: 'row', minHeight: 26}}>
        <Text style={[styles.sectionTitle, {flexGrow: 1}]}>HUMAN</Text>
        {hovering && !disableCopy && <HoverButton content="📋" onPress={() => console.log("Copy: Not yet implemented")}/>}
        {hovering && !disableEdit && <HoverButton content="📝" onPress={() => {console.log("Edit: Not yet implemented")}}/>}
        {hovering && contentShownOnHover}
      </View>
      {children}
    </Pressable>
  );
}

type AIImageResponseType = PropsWithChildren<{
  imageUrl?: string;
  prompt?: string;
  rejectImage: () => void;
}>;
function AIImageResponse({imageUrl, prompt, rejectImage}: AIImageResponseType): JSX.Element {
  const styles = React.useContext(StylesContext);
  return (
    <View style={[styles.horizontalContainer, {flexWrap: 'nowrap', alignItems: 'flex-start'}]}>
      <Image
        source={{uri: imageUrl}}
        alt={prompt}
        style={[{flexGrow: 0}, styles.dalleImage]}/>
      <View
        style={{flexShrink: 1, gap: 8}}>
        <Text>Here is an image created using the following requirements "{prompt}"</Text>
        <View style={{alignSelf: 'flex-end', alignItems: 'flex-end'}}>
          <Button
            title="I didn't want to see an image"
            onPress={() => {rejectImage()}}/>
          <Button
            title="Show me more"
            onPress={() => console.log("Not yet implemented")}/>
        </View>
      </View>
    </View>
  );
}

type AITextResponseType = PropsWithChildren<{
  text?: string;
}>;
function AITextResponse({text}: AITextResponseType): JSX.Element {
  let elements: JSX.Element[] = [];

  // Break up the text into code blocks and regular text
  if (text !== undefined) {
    // Look for the ``` separator (with option language)
    const regex = /^```(.*)$/gm;
    let matches = [...text.matchAll(regex)];

    // Keep track of where we are in the open/close code blocks
    let index = 0;
    let inCodeBlock = false;
    let currentLanguage = "";
    
    const appendToElements = (key: number, value: string) => {
      if (!inCodeBlock) {
        elements = [...elements, <Text key={key}>{value}</Text>];
      } else {
        elements = [...elements, <CodeBlock key={key} language={currentLanguage ?? "unknown"} content={value}/>];
      }
    }

    for (let i = 0; i < matches.length; i++) {
      // Grab the text since the last match, but strip out the separator/language
      let match = matches[i];
      let textSinceLast = text.substring(index, match.index).trim();
      index = match.index + match[0].length;

      appendToElements(i, textSinceLast);

      currentLanguage = match[1];
      inCodeBlock = !inCodeBlock;
    }

    // Add the remaining text after the last ``` separator
    if (index < text.length) {
      appendToElements(matches.length, text.substring(index, text.length).trim());
    }
  }

  return (
    <View style={{gap: 8}}>
      {elements}
    </View>
  );
}
  
type AISectionProps = PropsWithChildren<{
  isLoading?: boolean;
  contentShownOnHover?: JSX.Element;
}>;
function AISection({children, isLoading, contentShownOnHover}: AISectionProps): JSX.Element {
  const feedbackContext = React.useContext(FeedbackContext);
  const styles = React.useContext(StylesContext);
  const [hovering, setHovering] = React.useState(false);

  const showFeedbackPopup = (positive: boolean) => {
    if (feedbackContext) {
      feedbackContext.showFeedback(positive);
    }
  }

  return (
    <Pressable
      style={[styles.sectionContainer, styles.aiSection]}
      onHoverIn={() => setHovering(true)}
      onHoverOut={() => setHovering(false)}>
      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.sectionTitle, {flexGrow: 1}]}>AI</Text>
        {hovering && contentShownOnHover}
        {hovering && <HoverButton content="📋" onPress={() => console.log("Copy: Not yet implemented")}/>}
        <HoverButton content="👍" onPress={() => { showFeedbackPopup(true); }}/>
        <HoverButton content="👎" onPress={() => { showFeedbackPopup(false); }}/>
      </View>
      {isLoading && 
        <ActivityIndicator/>
      }
      <View style={{gap: 8}}>
        {children}
      </View>
    </Pressable>
  );
}

type AiSectionContentType = {
  content: ChatElement;
}
function AiSectionContent({content}: AiSectionContentType): JSX.Element {
  return (
    <AISection>
      {(() => {
        switch (content.contentType) {
          case ChatContent.Error:
            return <Text style={{color: 'red'}}>{content.text}</Text>
          case ChatContent.Image:
            return <AIImageResponse
              imageUrl={content.text}
              prompt={content.prompt}
              rejectImage={() => console.log("Not yet implemented")}/>; // TODO: This would need to reset back to the text prompt
          default:
          case ChatContent.Text:
            return <AITextResponse text={content.text}/>
        }
      })()}
    </AISection>
  )
}

type AISectionWithQueryProps = {
  prompt: string;
  id: number;
  onResponse: ({prompt, response, contentType} : { prompt: string, response: string, contentType: ChatContent} ) => void;
};
function AISectionWithQuery({prompt, id, onResponse}: AISectionWithQueryProps): JSX.Element {
  const settingsContext = React.useContext(SettingsContext);
  const chatScroll = React.useContext(ChatScrollContext);
  const chatHistory = React.useContext(ChatHistoryContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [queryResult, setQueryResult] = React.useState<string | undefined>(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isRequestForImage, setIsRequestForImage] = React.useState<boolean | undefined>(undefined);
  const [imagePrompt, setImagePrompt] = React.useState<string | undefined>(undefined);

  // First determine the intent of the prompt
  const imageIntentSentinel = "[IMAGE]";
  React.useEffect(() => {
    setIsLoading(true);
    setError(undefined);
    setIsRequestForImage(undefined);
    setImagePrompt(undefined);
    CallOpenAi({
      api: OpenAiApi.Completion,
      apiKey: settingsContext.apiKey,
      instructions: `You are an intuitive assistant helping the user with a project. Your only job is need to determine the primary intent of the user's last prompt.
If the user's primary intent is to request to see or create an image, respond with exactly the string "${imageIntentSentinel}". Otherwise, respond with a description of their intent.`,
      identifier: "INTENT:",
      prompt: prompt,
      onError: (error) => {
        setIsRequestForImage(false);
      },
      onResult: (result) => {
        const isImage = result == imageIntentSentinel;
        setIsRequestForImage(isImage);
      },
      onComplete: () => {
    }});
  }, [prompt]);
    

  // If the intent is to request an image, then we need to create keywords for the image prompt
  React.useEffect(() => {
    if (isRequestForImage) {
      setIsLoading(true);
      CallOpenAi({
        api: OpenAiApi.ChatCompletion,
        apiKey: settingsContext.apiKey,
        instructions: `You are an assistant helping the user generate an image from a description. Take the user's prompt and reply with a valid image prompt, which is be a comma-separated list of keywords describing the desired image. An example list of keywords:
- photography
- fun
- scary
- comics
- high quality
- highres
- art
- dull colors
- [name of a photographer]
- [name of a design studio]
- [visual adjective]
- [style of the image]
Where items enclosed in brackets ([]) would be replaced with an appropriate suggestion.
Respond with the image prompt string in the required format. Do not respond conversationally.`,
        identifier: "KEYWORDS:",
        prompt: prompt,
        onError: (error) => {
          setIsRequestForImage(false);
        },
        onResult: (result) => {
          setImagePrompt(result);
        },
        onComplete: () => {
      }});
    }
  }, [isRequestForImage]);

  React.useEffect(() => {
    if (isRequestForImage === false) {
      setIsLoading(true);
      CallOpenAi({
        api: OpenAiApi.ChatCompletion,
        apiKey: settingsContext.apiKey,
        instructions: `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. If the response involves code, use markdown format for that with \`\`\`(language) blocks.`,
        identifier: "TEXT-ANSWER:",
        prompt: prompt,
        promptHistory: chatHistory.entries.
          filter((entry) => { return entry.text !== undefined && entry.id < id; }).
          map((entry) => { return {role: entry.type == ChatSource.Human ? "user" : "assistant", "content": entry.text ?? ""} }),
        onError: (error) => {
          setError(error);
          onResponse({
            prompt: prompt,
            response: error ?? "",
            contentType: ChatContent.Error});
        },
        onResult: (result) => {
          setQueryResult(result);
          onResponse({
            prompt: prompt,
            response: result ?? "", 
            contentType: ChatContent.Text});
        },
        onComplete: () => {
          setIsLoading(false);
          chatScroll.scrollToEnd();
      }});
    } else {
      if (isRequestForImage == true && imagePrompt !== undefined) {
        setIsLoading(true);
        CallOpenAi({
          api: OpenAiApi.Generations,
          apiKey: settingsContext.apiKey,
          identifier: "IMAGE-ANSWER:",
          prompt: imagePrompt,
          onError: (error) => {
            setError(error);
            onResponse({
              prompt: imagePrompt,
              response: error ?? "",
              contentType: ChatContent.Error});
          },
          onResult: (result) => {
            setQueryResult(result);
            onResponse({
              prompt: imagePrompt,
              response: result ?? "",
              contentType: ChatContent.Image});
          },
          onComplete: () => {
            setIsLoading(false);
            chatScroll.scrollToEnd();
        }});
      }
    }
  }, [imagePrompt, isRequestForImage]);

  return (
    <AISection isLoading={isLoading}>
      {
        // TODO: All of this can go away now, once images are working in new model
        (isLoading || error) ?
          <Text style={{color: 'crimson'}}>{error}</Text>
        : isRequestForImage ? 
          <AIImageResponse
            imageUrl={queryResult}
            prompt={imagePrompt}
            rejectImage={() => {
              setIsRequestForImage(false);
              setQueryResult(undefined);
          }}/>
        : // Not an error, not an image
          <AITextResponse
            text={queryResult}/>
      }
    </AISection>
  )
}

function AISectionWithFakeResponse({children}: PropsWithChildren): JSX.Element {
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
    <AISection isLoading={isLoading}>
      {!isLoading && children}
    </AISection>
  )
}

export { HumanSection, AISectionWithFakeResponse, AISectionWithQuery, AiSectionContent }