// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#pragma once

#include "pch.h"

#include "NativeModules.h"
#include "../../codegen/NativeClipboardSpec.g.h"

#include <wil/result.h>

namespace ArtificialChatModules
{
  REACT_MODULE(Clipboard);
  struct Clipboard
  {
    using ModuleSpec = ClipboardSpec;

    REACT_METHOD(SetString, L"setString");
    void SetString(std::wstring content) noexcept
    {
      const auto result = [&]
      {
        // Allocate the contents in a way that can be passed to the clipboard
        HGLOBAL hMem{ NULL };
        size_t length = wcslen(content.c_str());
        RETURN_LAST_ERROR_IF_NULL(hMem = GlobalAlloc(GMEM_MOVEABLE, ((length + 1) * sizeof(WCHAR))));
        LPWSTR dest = reinterpret_cast<LPWSTR>(GlobalLock(hMem));
        memcpy(dest, content.c_str(), (length * sizeof(WCHAR)));
        dest[length] = L'\0';
        GlobalUnlock(hMem);
      
        // Set the string clipboard contents
        RETURN_IF_WIN32_BOOL_FALSE(OpenClipboard(NULL));
        RETURN_IF_WIN32_BOOL_FALSE(EmptyClipboard());
        RETURN_LAST_ERROR_IF_NULL(SetClipboardData(CF_UNICODETEXT, hMem));
        RETURN_IF_WIN32_BOOL_FALSE(CloseClipboard());

        return S_OK;
      }();
    }
  };
}