import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {

  getConstants: () => {
    appVersion: string,
    buildVersion: string,
  };
}

export default TurboModuleRegistry.get<Spec>(
  'VersionInfo'
) as Spec | null;