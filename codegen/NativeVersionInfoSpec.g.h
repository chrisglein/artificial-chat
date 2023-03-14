
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

REACT_STRUCT(VersionInfoSpec_Constants)
struct VersionInfoSpec_Constants {
    REACT_FIELD(E)
    double E;
    REACT_FIELD(Pi)
    double Pi;
};

struct VersionInfoSpec : winrt::Microsoft::ReactNative::TurboModuleSpec {
  static constexpr auto constants = std::tuple{
      TypedConstant<VersionInfoSpec_Constants>{0},
  };
  static constexpr auto methods = std::tuple{
      Method<void(double, double, Callback<double>) noexcept>{0, L"add"},
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

    REACT_SHOW_METHOD_SPEC_ERRORS(
          0,
          "add",
          "    REACT_METHOD(add) void add(double a, double b, std::function<void(double)> const & callback) noexcept { /* implementation */ }\n"
          "    REACT_METHOD(add) static void add(double a, double b, std::function<void(double)> const & callback) noexcept { /* implementation */ }\n");
  }
};

} // namespace ArtificialChatModules
