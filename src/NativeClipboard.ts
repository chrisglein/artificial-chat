import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {

  setString(content: string): void;
}

export default TurboModuleRegistry.get<Spec>(
  'Clipboard'
) as Spec | null;