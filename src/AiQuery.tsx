import React from 'react';
import { Text } from 'react-native';
import {
  OpenAiApi,
  CallOpenAi,
} from './OpenAI';
import { AiSection } from './AiResponse';
import { 
  ChatSource,
  ChatContent,
  ChatScrollContext,
  ChatHistoryContext
} from './Chat';
import { SettingsContext } from './Settings';

// Component that drives the queries to OpenAi to respond to a prompt
type AiSectionWithQueryProps = {
  prompt: string;
  intent?: string;
  id: number;
  onResponse: ({prompt, intent, responses, contentType} : { prompt: string, intent?: string, responses: string[], contentType: ChatContent} ) => void;
};
function AiSectionWithQuery({prompt, intent, id, onResponse}: AiSectionWithQueryProps): JSX.Element {
  const settingsContext = React.useContext(SettingsContext);
  const chatScroll = React.useContext(ChatScrollContext);
  const chatHistory = React.useContext(ChatHistoryContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRequestForImage, setIsRequestForImage] = React.useState<boolean | undefined>(undefined);
  const [imagePrompt, setImagePrompt] = React.useState<string | undefined>(undefined);

  // First determine the intent of the prompt
  const imageIntentSentinel = "[IMAGE]";
  React.useEffect(() => {
    setIsLoading(true);
    setIsRequestForImage(undefined);
    setImagePrompt(undefined);
    if (intent === 'text' || !settingsContext.detectImageIntent) {
      setIsRequestForImage(false);
      return;
    }
    if (intent === 'image') {
      setImagePrompt(prompt);
      setIsRequestForImage(true);
      return;
    }
    CallOpenAi({
      api: OpenAiApi.ChatCompletion,
      apiKey: settingsContext.apiKey,
      options: {
        endpoint: settingsContext.aiEndpoint,
        chatModel: settingsContext.chatModel,
      },
      instructions: `You are an intuitive assistant helping the user with a project. Your only job is need to determine the primary intent of the user's last prompt.
If and only if you are absolutely certain the user's primary intent is to see an image, respond with exactly the string "${imageIntentSentinel}". Otherwise, respond with your description of their intent.`,
      identifier: "INTENT:",
      prompt: prompt,
      onError: () => {
        setIsRequestForImage(false);
      },
      onResult: (result) => {
        const isImage = result[0] == imageIntentSentinel;
        setIsRequestForImage(isImage);
      },
      onComplete: () => {
    }});
  }, [prompt]);
    

  // If the intent is to request an image, then we need to create keywords for the image prompt
  React.useEffect(() => {
    if (isRequestForImage && imagePrompt === undefined) {
      setIsLoading(true);
      CallOpenAi({
        api: OpenAiApi.ChatCompletion,
        apiKey: settingsContext.apiKey,
        options: {
          endpoint: settingsContext.aiEndpoint,
          chatModel: settingsContext.chatModel,
        },
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
        onError: () => {
          setIsRequestForImage(false);
        },
        onResult: (result) => {
          setImagePrompt(result[0]);
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
        options: {
          endpoint: settingsContext.aiEndpoint,
          chatModel: settingsContext.chatModel,
          promptHistory: chatHistory.entries.
            filter((entry) => { return entry.responses !== undefined && entry.id < id; }).
            map((entry) => { return {role: entry.type == ChatSource.Human ? "user" : "assistant", "content": entry.responses ? entry.responses[0] : ""} }),
        },
        onError: (error) => {
          onResponse({
            prompt: prompt,
            responses: [error] ?? [""],
            contentType: ChatContent.Error});
        },
        onResult: (result) => {
          onResponse({
            prompt: prompt,
            responses: result ?? [""], 
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
          options: {
            endpoint: settingsContext.aiEndpoint,
            responseCount: settingsContext.imageResponseCount,
            imageSize: settingsContext.imageSize,
          },
          onError: (error) => {
            onResponse({
              prompt: imagePrompt,
              responses: [error] ?? [""],
              contentType: ChatContent.Error});
          },
          onResult: (result) => {
            onResponse({
              prompt: imagePrompt,
              responses: result ?? [""],
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
    <AiSection id={id} isLoading={isLoading}>
      {
        (isLoading ?
          isRequestForImage === undefined ?
            <Text>Identifying intent...</Text> :
            isRequestForImage === true ?
              imagePrompt === undefined ?
                <Text>Generating keywords for an image...</Text> :
                <Text>Generating image...</Text> :
              <Text>Generating text...</Text>
            :
          <Text>Done loading</Text>)
      }
    </AiSection>
  )
}

export { AiSectionWithQuery }