// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#pragma once

#include "pch.h"

#include "NativeModules.h"
#include "../../codegen/NativeVersionInfoSpec.g.h"

#include <winrt/Windows.ApplicationModel.h>
#include <strsafe.h>

namespace ArtificialChatModules
{
    REACT_MODULE(VersionInfo);
    struct VersionInfo
    {
        using ModuleSpec = VersionInfoSpec;

        REACT_GET_CONSTANTS(GetConstants)
        VersionInfoSpec_Constants GetConstants() noexcept
        {
            winrt::Windows::ApplicationModel::PackageVersion version = winrt::Windows::ApplicationModel::Package::Current().Id().Version();

            VersionInfoSpec_Constants constants;
            char buffer[256];
            StringCchPrintfA(buffer, _countof(buffer), "%d.%d.%d", version.Major, version.Minor, version.Build);
            constants.appVersion = std::string(buffer);
            constants.buildVersion = std::to_string(version.Revision);
            return constants;
        }
    };
}