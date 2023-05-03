
/*
 * This file is auto-generated from a NativeModule spec file in js.
 *
 * This is a C++ Spec class that should be used with MakeTurboModuleProvider to register native modules
 * in a way that also verifies at compile time that the native module matches the interface required
 * by the TurboModule JS spec.
 */
#pragma once

#include "NativeModules.h"
#include <tuple>

namespace ArtificialChatModules {

struct ClipboardSpec : winrt::Microsoft::ReactNative::TurboModuleSpec {
  static constexpr auto methods = std::tuple{
      Method<void(std::string) noexcept>{0, L"setString"},
  };

  template <class TModule>
  static constexpr void ValidateModule() noexcept {
    constexpr auto methodCheckResults = CheckMethods<TModule, ClipboardSpec>();

    REACT_SHOW_METHOD_SPEC_ERRORS(
          0,
          "setString",
          "    REACT_METHOD(setString) void setString(std::string content) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(setString) static void setString(std::string content) noexcept { /* implementation */ }\n");
  }
};

} // namespace ArtificialChatModules
