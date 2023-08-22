
/*
 * This file is auto-generated from a NativeModule spec file in js.
 *
 * This is a C++ Spec class that should be used with MakeTurboModuleProvider to register native modules
 * in a way that also verifies at compile time that the native module matches the interface required
 * by the TurboModule JS spec.
 */
#pragma once

#include <NativeModules.h>
#include <tuple>

namespace ArtificialChatModules {

struct VersionInfoSpec_Constants {
    std::string appVersion;
    std::string buildVersion;
};


inline winrt::Microsoft::ReactNative::FieldMap GetStructInfo(VersionInfoSpec_Constants*) noexcept {
    winrt::Microsoft::ReactNative::FieldMap fieldMap {
        {L"appVersion", &VersionInfoSpec_Constants::appVersion},
        {L"buildVersion", &VersionInfoSpec_Constants::buildVersion},
    };
    return fieldMap;
}

struct VersionInfoSpec : winrt::Microsoft::ReactNative::TurboModuleSpec {
  static constexpr auto constants = std::tuple{
      TypedConstant<VersionInfoSpec_Constants>{0},
  };
  static constexpr auto methods = std::tuple{

  };

  template <class TModule>
  static constexpr void ValidateModule() noexcept {
    constexpr auto constantCheckResults = CheckConstants<TModule, VersionInfoSpec>();
    constexpr auto methodCheckResults = CheckMethods<TModule, VersionInfoSpec>();

    REACT_SHOW_CONSTANT_SPEC_ERRORS(
          0,
          "VersionInfoSpec_Constants",
          "    REACT_GET_CONSTANTS(GetConstants) VersionInfoSpec_Constants GetConstants() noexcept {/*implementation*/}\n"
          "    REACT_GET_CONSTANTS(GetConstants) static VersionInfoSpec_Constants GetConstants() noexcept {/*implementation*/}\n");


  }
};

} // namespace ArtificialChatModules
