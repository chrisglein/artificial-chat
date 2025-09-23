import NativeLocalAI from './NativeLocalAI';

type LocalAIHandlerType = {
  instructions?: string;
};

type CallLocalAIType = {
  instructions?: string;
  identifier?: string;
  prompt: string;
  onError: (error: string) => void;
  onResult: (results: string[]) => void;
  onComplete: () => void;
};

const CallLocalAI = async ({
  instructions,
  identifier,
  prompt,
  onError,
  onResult,
  onComplete,
}: CallLocalAIType) => {
  try {
    if (!NativeLocalAI) {
      onError('Local AI is not available on this platform');
      onComplete();
      return;
    }

    // Check if local AI is supported
    const capabilities = NativeLocalAI.checkCapabilities();
    if (!capabilities.isSupported) {
      onError('Local AI is not supported on this device. Compatible NPU/GPU hardware required.');
      onComplete();
      return;
    }

    console.debug(`Start LocalAI ${identifier}"${prompt}"`);

    const actualInstructions =
      instructions ??
      'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. You may use markdown syntax in the response as appropriate.';

    const result = await NativeLocalAI.generateText(prompt, actualInstructions);
    
    console.log(`LocalAI response: "${result}"`);
    onResult([result]);
  } catch (error) {
    console.error('LocalAI error:', error);
    onError(error instanceof Error ? error.message : 'Error generating local AI response');
  } finally {
    console.debug(`End LocalAI ${identifier}"${prompt}"`);
    onComplete();
  }
};

// Function to check if local AI is available
const IsLocalAIAvailable = (): boolean => {
  if (!NativeLocalAI) {
    return false;
  }
  
  try {
    const capabilities = NativeLocalAI.checkCapabilities();
    return capabilities.isSupported;
  } catch {
    return false;
  }
};

// Function to get local AI capabilities info
const GetLocalAICapabilities = () => {
  if (!NativeLocalAI) {
    return { isSupported: false, hasNPU: false, hasGPU: false };
  }
  
  try {
    return NativeLocalAI.checkCapabilities();
  } catch {
    return { isSupported: false, hasNPU: false, hasGPU: false };
  }
};

export { CallLocalAI, IsLocalAIAvailable, GetLocalAICapabilities };