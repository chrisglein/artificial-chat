/*
 * This file is auto-generated from a NativeModule spec file in js.
 *
 * This is a C++ Spec class that should be used with MakeTurboModuleProvider to register native modules
 * in a way that also verifies at compile time that the native module matches the interface required
 * by the TurboModule JS spec.
 */
#pragma once
// clang-format off

#include <NativeModules.h>
#include <tuple>

namespace ArtificialChatModules {

struct LocalAISpec_LocalAICapabilities {
    bool isSupported;
    bool hasNPU;
    bool hasGPU;
    std::optional<std::string> modelName;
};


inline winrt::Microsoft::ReactNative::FieldMap GetStructInfo(LocalAISpec_LocalAICapabilities*) noexcept {
    winrt::Microsoft::ReactNative::FieldMap fieldMap {
        {L"isSupported", &LocalAISpec_LocalAICapabilities::isSupported},
        {L"hasNPU", &LocalAISpec_LocalAICapabilities::hasNPU},
        {L"hasGPU", &LocalAISpec_LocalAICapabilities::hasGPU},
        {L"modelName", &LocalAISpec_LocalAICapabilities::modelName},
    };
    return fieldMap;
}

struct LocalAISpec : winrt::Microsoft::ReactNative::TurboModuleSpec {
  static constexpr auto methods = std::tuple{
      SyncMethod<LocalAISpec_LocalAICapabilities() noexcept>{0, L"checkCapabilities"},
      Method<void(std::string, std::optional<std::string>, Promise<std::string>) noexcept>{1, L"generateText"},
  };

  template <class TModule>
  static constexpr void ValidateModule() noexcept {
    constexpr auto methodCheckResults = CheckMethods<TModule, LocalAISpec>();

    REACT_SHOW_METHOD_SPEC_ERRORS(
          0,
          "checkCapabilities",
          "    REACT_SYNC_METHOD(checkCapabilities) LocalAISpec_LocalAICapabilities checkCapabilities() noexcept { /* implementation */ }\n"
          "    REACT_SYNC_METHOD(checkCapabilities) static LocalAISpec_LocalAICapabilities checkCapabilities() noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          1,
          "generateText",
          "    REACT_METHOD(generateText) void generateText(std::string prompt, std::optional<std::string> systemInstructions, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(generateText) static void generateText(std::string prompt, std::optional<std::string> systemInstructions, ::React::ReactPromise<std::string> &&result) noexcept { /* implementation */ }\n");
  }
};

} // namespace ArtificialChatModules