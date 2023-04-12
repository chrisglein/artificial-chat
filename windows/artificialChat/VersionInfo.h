// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#pragma once

#include "pch.h"

#include "NativeModules.h"
#include "../../codegen/NativeVersionInfoSpec.g.h"

#include <winrt/Windows.ApplicationModel.h>
#include <strsafe.h>
#include <wil/result.h>

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

      const auto result = [&]
      {
        // Get full path to exe
        wchar_t modulePath[MAX_PATH]{ 0 };
        RETURN_LAST_ERROR_IF(GetModuleFileName(nullptr, modulePath, sizeof(modulePath)) == 0);

        // Get the version information block
        DWORD dwSize = GetFileVersionInfoSize(modulePath, nullptr);
        RETURN_LAST_ERROR_IF(dwSize == 0);
        std::unique_ptr<BYTE[]> block(new BYTE[dwSize]);
        RETURN_IF_WIN32_BOOL_FALSE(GetFileVersionInfo(modulePath, 0, dwSize, block.get()));

        // Read out the language and code page
        struct LANGANDCODEPAGE {
          WORD language;
          WORD codePage;
        };
        LANGANDCODEPAGE* translate;
        unsigned int size;
        RETURN_IF_WIN32_BOOL_FALSE(VerQueryValue(
          block.get(),
          L"\\VarFileInfo\\Translation",
          reinterpret_cast<LPVOID*>(&translate),
          &size));

        // Get the ProductVersion value for this language
        BYTE* subblock;
        wchar_t query[256];
        StringCchPrintf(
          query,
          _countof(query),
          L"\\StringFileInfo\\%04x%04x\\ProductVersion",
          translate->language,
          translate->codePage);
        RETURN_IF_WIN32_BOOL_FALSE(VerQueryValue(
          block.get(),
          query,
          reinterpret_cast<void**>(&subblock),
          &size));
        if (size > 0)
        {
          // Value comes back as a wide string, native module will need that converted
          auto convertWideString = [](const std::wstring& wide)
          {
            const auto sizeNeeded = WideCharToMultiByte(CP_UTF8, 0, &wide.at(0), static_cast<int>(wide.size()), nullptr, 0, nullptr, nullptr);
            std::string result(sizeNeeded, 0);
            WideCharToMultiByte(CP_UTF8, 0, &wide.at(0), static_cast<int>(wide.size()), &result.at(0), sizeNeeded, nullptr, nullptr);
            return result;
          };
          constants.appVersion = convertWideString(reinterpret_cast<LPCWSTR>(subblock));
        }

        return S_OK;
      }();
      
      return constants;
    }
  };
}