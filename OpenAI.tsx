// Based on https://github.com/njerschow/openai-api, but trimming dependencies to use native fetch
const OpenAIUrl = () => {
  const DefaultEngine = 'davinci';
  const BaseApiUrl = 'https://api.openai.com';
  const APIVersion = 'v1';
  const OpenAIUrl = `${BaseApiUrl}/${APIVersion}`;

  return {
    completion: (engine? : string) => {
      return `${OpenAIUrl}/engines/${engine ?? DefaultEngine}/completions`;
    },
    search: (engine? : string) => {
      return `${OpenAIUrl}/engines/${engine ?? DefaultEngine}/search`;
    },
    engines: () => {
      return `${OpenAIUrl}/engines`;
    },
    engine: (engine? : string) => {
      return `${OpenAIUrl}/engines/${engine ?? DefaultEngine}`;
    },
    classifications: () => {
      return `${OpenAIUrl}/classifications`;
    },
    files: () => {
      return `${OpenAIUrl}/files`;
    },
    answers: () => {
      return `${OpenAIUrl}/answers`;
    },
    embeddings: (engine? : string) => {
      return `${OpenAIUrl}/engines/${engine ?? DefaultEngine}/embeddings`;
    }
  };
}

type CallOpenAIProps = {
  url: string,
  apiKey?: string,
  prompt: string,
  onError: (error: string) => void,
  onResult: (result: string) => void,
  onComplete: () => void
}
const CallOpenAI = async ({url, apiKey, prompt, onError, onResult, onComplete}: CallOpenAIProps) => {
  const DefaultApiKey = "REDACTED";
  try {
    console.log("start loading");
    let wrappedPrompt = `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\nHuman: ${prompt}.\nAI:`;

    let response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Authorization': `Bearer ${apiKey ?? DefaultApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      }),
    });
    
    try {
      const json = await response.json();

      try {
        let fullTextResult = json.choices[0].text;
        let trimmedTextResult = fullTextResult.match("AI:\w*(.+)")[1];

        console.log(`AI response: "${trimmedTextResult}"`);
        onResult(trimmedTextResult);
      } catch (error) {
        onError(`Error parsing AI response text "${json}"`);
      }
    } catch (error) { 
      onError(`Error parsing JSON`);
    }
  } catch (error) {
    onError("Error in http POST");
    onError(error.stack);
  } finally {
    console.log("done loading");
    onComplete();
  }
}

export { OpenAIUrl, CallOpenAI };