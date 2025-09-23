import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface LocalAICapabilities {
  isSupported: boolean;
  hasNPU: boolean;
  hasGPU: boolean;
  modelName?: string;
}

export interface Spec extends TurboModule {
  checkCapabilities(): LocalAICapabilities;
  generateText(prompt: string, systemInstructions?: string): Promise<string>;
}

export default TurboModuleRegistry.get<Spec>(
  'LocalAI'
) as Spec | null;