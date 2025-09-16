
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

struct SpeechSpec_VoiceInfo {
    std::string displayName;
    std::string language;
    std::string id;
    bool isCurrent;
};


inline winrt::Microsoft::ReactNative::FieldMap GetStructInfo(SpeechSpec_VoiceInfo*) noexcept {
    winrt::Microsoft::ReactNative::FieldMap fieldMap {
        {L"displayName", &SpeechSpec_VoiceInfo::displayName},
        {L"language", &SpeechSpec_VoiceInfo::language},
        {L"id", &SpeechSpec_VoiceInfo::id},
        {L"isCurrent", &SpeechSpec_VoiceInfo::isCurrent},
    };
    return fieldMap;
}

struct SpeechSpec : winrt::Microsoft::ReactNative::TurboModuleSpec {
  static constexpr auto methods = std::tuple{
      Method<void(std::string, Promise<void>) noexcept>{0, L"speak"},
      SyncMethod<std::vector<SpeechSpec_VoiceInfo>() noexcept>{1, L"getVoices"},
      Method<void(std::string) noexcept>{2, L"setVoice"},
  };

  template <class TModule>
  static constexpr void ValidateModule() noexcept {
    constexpr auto methodCheckResults = CheckMethods<TModule, SpeechSpec>();

    REACT_SHOW_METHOD_SPEC_ERRORS(
          0,
          "speak",
          "    REACT_METHOD(speak) void speak(std::string text, ::React::ReactPromise<void> &&result) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(speak) static void speak(std::string text, ::React::ReactPromise<void> &&result) noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          1,
          "getVoices",
          "    REACT_SYNC_METHOD(getVoices) std::vector<SpeechSpec_VoiceInfo> getVoices() noexcept { /* implementation */ }\n"
          "    REACT_SYNC_METHOD(getVoices) static std::vector<SpeechSpec_VoiceInfo> getVoices() noexcept { /* implementation */ }\n");
    REACT_SHOW_METHOD_SPEC_ERRORS(
          2,
          "setVoice",
          "    REACT_METHOD(setVoice) void setVoice(std::string voiceId) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(setVoice) static void setVoice(std::string voiceId) noexcept { /* implementation */ }\n");
  }
};

} // namespace ArtificialChatModules
