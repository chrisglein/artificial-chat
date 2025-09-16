import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface VoiceInfo {
  displayName: string;
  language: string;
  id: string;
  isCurrent: boolean;
}

export interface Spec extends TurboModule {
  speak(text: string): Promise<void>;
  getVoices(): VoiceInfo[];
  setVoice(voiceId?: string): void;
}

export default TurboModuleRegistry.get<Spec>(
  'Speech'
) as Spec | null;