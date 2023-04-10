#pragma once

#include "winrt/Microsoft.ReactNative.h"
#include "VersionInfo.h"

namespace winrt::artificialChat::implementation
{
    struct ReactPackageProvider : winrt::implements<ReactPackageProvider, winrt::Microsoft::ReactNative::IReactPackageProvider>
    {
    public: // IReactPackageProvider
        void CreatePackage(winrt::Microsoft::ReactNative::IReactPackageBuilder const &packageBuilder) noexcept;
    };
} // namespace winrt::artificialChat::implementation

