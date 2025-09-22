enum OpenAiApi {
  Completion,
  ChatCompletion,
  Generations,
}

type OpenAiHandlerOptions = {
  endpoint?: string;
  engine?: string;
  chatModel?: string;
  promptHistory?: ConversationEntry[];
  responseCount?: number;
  imageSize?: number;
};

type ConversationEntry = {
  role: 'user' | 'system' | 'assistant',
  content: string,
}

type OpenAiHandlerType = {
  api: OpenAiApi;
  options?: OpenAiHandlerOptions;
  instructions?: string;
};
const OpenAiHandler = ({api, options, instructions}: OpenAiHandlerType) => {
  const OpenAIUrl = options?.endpoint ?? 'https://api.openai.com/v1';

  let actualInstructions =
    instructions ??
    'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.';

  switch (api) {
    case OpenAiApi.Completion:
      return {
        url: `${OpenAIUrl}/engines/text-davinci-003-playground/completions`,
        body: (prompt: string) => {
          let wrappedPrompt = `${actualInstructions}\nHuman: ${prompt}.\nAI:`;
          return {
            best_of: options?.responseCount ?? 1,
            echo: true,
            frequency_penalty: 0,
            logprobs: 0,
            max_tokens: 150,
            presence_penalty: 0.6,
            prompt: wrappedPrompt,
            stop: [' Human:', ' AI:'],
            stream: false,
            temperature: 0.9,
            top_p: 1,
          };
        },
        response: (json: any) => {
          let fullTextResult = json.choices[0].text;
          let regex = /^Human:\s([\s\S]+)^AI:\s([\s\S]+)/gm;
          let match = fullTextResult.matchAll(regex).next().value;
          let trimmedTextResult = match[2].trim();
          console.log(`AI response: "${trimmedTextResult}"`);
          return [trimmedTextResult];
        },
      };
    case OpenAiApi.ChatCompletion:
      return {
        url: `${OpenAIUrl}/chat/completions`,
        body: (prompt: string) => {
          return {
            model: options?.chatModel ?? 'gpt-3.5-turbo',
            messages: [
              {'role': 'system', 'content': actualInstructions},
              ...options?.promptHistory ?? [],
              {'role': 'user', 'content': prompt},
            ],
          };
        },
        response: (json: any) => {
          let result = json.choices[0].message.content;
          console.log(`AI response: "${result}"`);
          return [result];
        },
      };
    case OpenAiApi.Generations:
      return {
        url: `${OpenAIUrl}/images/generations`,
        body: (prompt: string) => {
          let imageSize = options?.imageSize ?? 1024;
          return {
            prompt: prompt,
            n: options?.responseCount ?? 1,
            size: `${imageSize}x${imageSize}`,
          };
        },
        response: (json: any) => {
          console.log(`AI response: "${json.data[0].url}"`);
          return json.data.map((item: any) => item.url);
        },
      };
    default:
      throw new Error(`Unknown API ${api}`);
  }
};

type CallOpenAiType = {
  api: OpenAiApi;
  apiKey?: string;
  instructions?: string;
  identifier?: string;
  prompt: string;
  options?: OpenAiHandlerOptions;
  onError: (error: string) => void;
  onResult: (results: string[]) => void;
  onComplete: () => void;
  countTowardsTrial?: boolean; // Whether this call should count against trial usage
};
const CallOpenAi = async ({
  api,
  apiKey,
  instructions,
  identifier,
  prompt,
  options,
  onError,
  onResult,
  onComplete,
  countTowardsTrial = true, // Default to true for backward compatibility
}: CallOpenAiType) => {
  const { getEffectiveApiKey, incrementTrialUsage, isUsingTrialMode } = require('./TrialMode');

  let effectiveApiKey = await getEffectiveApiKey(apiKey);

  if (!effectiveApiKey) {
    const errorMessage = 'To use this app, you need an OpenAI API key. Get one at https://platform.openai.com/account/api-keys and enter it in Settings.';
    onError(errorMessage);
    onComplete();
    return;
  }

  // Track trial usage if using trial mode and this call should count
  const usingTrial = await isUsingTrialMode(apiKey);
  if (usingTrial && countTowardsTrial) {
    await incrementTrialUsage();
  }

  try {
    console.debug(`Start ${identifier}"${prompt}"`);

    let apiHandler = OpenAiHandler({
      api: api,
      options: options,
      instructions: instructions,
    });

    let url = apiHandler.url;
    let body = apiHandler.body(prompt);
    console.debug(body);

    let response = await fetch(
      url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Authorization': `Bearer ${effectiveApiKey}`,
          'Content-Type': 'application/json',
          // Azure endpoint seems to want this instead of Bearer, despite docs https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/managed-identity#assign-yourself-to-the-cognitive-services-user-role
          'Ocp-Apim-Subscription-Key': `${effectiveApiKey}`,
        },
        body: JSON.stringify(body),
      });

    try {
      let json = await response.json();

      try {
        console.debug(`Have result for ${identifier}"${prompt}"`);

        // Seeing this with some Azure endpoints, working around it with a warning
        if (typeof json === 'string') {
          console.warn('Response came as string instead of JSON');
          json = JSON.parse(json);
        }

        console.debug(json);

        if (json.error) {
          onError(json.error.message);
        } else {
          onResult(apiHandler.response(json));
        }
      } catch (error) {
        onError(`Error parsing AI response text "${json}"`);
      }
    } catch (error) {
      onError('Error parsing JSON');
    }
  } catch (error) {
    onError('Error in http POST');
  } finally {
    console.debug(`End ${identifier}"${prompt}"`);
    onComplete();
  }
};

export { CallOpenAi, OpenAiApi };
