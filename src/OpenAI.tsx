enum OpenAiApi {
  Completion,
  ChatCompletion,
  Generations,
}

type ConversationEntry = {
  role: "user" | "system" | "assistant",
  content: string,
}

type OpenAiHandlerOptions = {
  promptHistory?: ConversationEntry[],
  imageSize?: 256 | 512 | 1024,
}
type OpenAiHandlerType = {
  api: OpenAiApi,
  engine?: string,
  instructions?: string,
}
const OpenAiHandler = ({api, engine, instructions}: OpenAiHandlerType) => {
  const DefaultEngine = 'text-davinci-003-playground';
  const BaseApiUrl = 'https://api.openai.com';
  const APIVersion = 'v1';
  const OpenAIUrl = `${BaseApiUrl}/${APIVersion}`;

  let actualInstructions = instructions ?? 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.';

  switch (api) {
    case OpenAiApi.Completion: 
      return {
        url: `${OpenAIUrl}/engines/${engine ?? DefaultEngine}/completions`,
        body: (prompt: string, options?: OpenAiHandlerOptions) => {
          let wrappedPrompt = `${actualInstructions}\nHuman: ${prompt}.\nAI:`;
          return {
            best_of: 1,
            echo: true,
            frequency_penalty: 0,
            logprobs: 0,
            max_tokens: 150,
            presence_penalty: 0.6,
            prompt: wrappedPrompt,
            stop: [" Human:", " AI:"],
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
          return trimmedTextResult;
        }
      }
    case OpenAiApi.ChatCompletion: 
      return {
        url: `${OpenAIUrl}/chat/completions`,
        body: (prompt: string, options?: OpenAiHandlerOptions) => {
          return {
            model: "gpt-3.5-turbo",
            messages: [
              {"role": "system", "content": actualInstructions},
              ...options?.promptHistory ?? [],
              {"role": "user", "content": prompt},
            ]
          };
        },
        response: (json: any) => {
          let result = json.choices[0].message.content;
          console.log(`AI response: "${result}"`);
          return result;
        }
      }
    case OpenAiApi.Generations: 
      return {
        url: `${OpenAIUrl}/images/generations`,
        body: (prompt: string, options?: OpenAiHandlerOptions) => {
          const imageSize = options?.imageSize ?? 256;
          return {
            prompt: prompt,
            n: 1,
            size: `${imageSize}x${imageSize}`,
          };
        },
        response: (json: any) => {
          console.log(`AI response: "${json.data[0].url}"`);
          return json.data[0].url;
        },
      }
    default:
      throw new Error(`Unknown API ${api}`);
  }
}

type CallOpenAiType = {
  api: OpenAiApi,
  apiKey?: string,
  instructions?: string,
  identifier?: string,
  prompt: string,
  options?: OpenAiHandlerOptions,
  onError: (error: string) => void,
  onResult: (result: string) => void,
  onComplete: () => void
}
const CallOpenAi = async ({api, apiKey, instructions, identifier, prompt, options, onError, onResult, onComplete}: CallOpenAiType) => {
  const DefaultApiKey = undefined; // During development you can paste your API key here, but DO NOT CHECK IN
  let effectiveApiKey = apiKey ?? DefaultApiKey;

  if (!effectiveApiKey) {
    onError("No API key provided");
    onComplete();
    return;
  }

  try {
    console.debug(`Start ${identifier}"${prompt}"`);

    let apiHandler = OpenAiHandler({api: api, instructions: instructions});

    let url = apiHandler.url;
    let body = apiHandler.body(prompt, options);
    console.debug(body);

    let response = await fetch(
      url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Authorization': `Bearer ${effectiveApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    
    try {
      const json = await response.json();

      try {
        console.debug(`Have result for ${identifier}"${prompt}"`);
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
      onError(`Error parsing JSON`);
    }
  } catch (error) {
    onError("Error in http POST");
  } finally {
    console.debug(`End ${identifier}"${prompt}"`);
    onComplete();
  }
}

export { CallOpenAi, OpenAiApi };