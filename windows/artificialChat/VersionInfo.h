// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#pragma once

#include "pch.h"

#include <functional>
#define _USE_MATH_DEFINES
#include <math.h>

#include "NativeModules.h"
#include "../../codegen/NativeVersionInfoSpec.g.h"

namespace ArtificialChatModules
{
    REACT_MODULE(VersionInfo);
    struct VersionInfo
    {
        using ModuleSpec = VersionInfoSpec;

        REACT_GET_CONSTANTS(GetConstants)
        VersionInfoSpec_Constants GetConstants() noexcept
        {
            VersionInfoSpec_Constants constants;
            constants.E = M_E;
            constants.Pi = M_PI;
            return constants;
        }

        REACT_METHOD(Add, L"add");
        double Add(double a, double b) noexcept
        {
            double result = a + b;
            AddEvent(result);
            return result;
        }

        REACT_EVENT(AddEvent);
        std::function<void(double)> AddEvent;
    };
}