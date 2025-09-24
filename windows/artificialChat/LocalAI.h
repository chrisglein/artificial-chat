// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#pragma once

#include "pch.h"

#include "NativeModules.h"
#include "../../codegen/NativeLocalAISpec.g.h"

// Windows AI Foundry includes for Phi Silica
// Requires Windows 11 with compatible NPU hardware and Windows App SDK 1.8+
#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Foundation.Collections.h>
#include <winrt/Microsoft.Windows.AI.Text.h>

/*
 * LocalAI TurboModule Implementation
 * 
 * This module provides local NPU/GPU-accelerated text generation using Microsoft's Phi Silica model
 * through the Windows AI Foundry APIs. It enables the app to perform AI text generation locally
 * instead of relying on cloud-based API calls when compatible hardware is available.
 * 
 * Hardware Requirements:
 * - Windows 11 (22H2 or later)
 * - Compatible NPU (Neural Processing Unit) - typically found in CoPilot+ PCs
 * - Windows App SDK 1.8 or later
 * 
 * Features:
 * - Automatic hardware capability detection
 * - Local Phi Silica model inference
 * - Graceful fallback when hardware is unsupported
 * - System instruction support for consistent AI behavior
 * - Proper error handling and user feedback
 */

namespace ArtificialChatModules
{
  REACT_MODULE(LocalAI);
  struct LocalAI
  {
    using ModuleSpec = LocalAISpec;

    LocalAI() 
    {
      // Initialize will be done lazily when needed
    }

    // Synchronously check if local AI capabilities are available on this device
    REACT_SYNC_METHOD(checkCapabilities)
    LocalAISpec_LocalAICapabilities checkCapabilities() noexcept
    {
      LocalAISpec_LocalAICapabilities capabilities;
      
      try 
      {
        // Check if Phi Silica language model is available
        // This will only succeed on compatible CoPilot+ PCs with proper NPU support
        auto languageModel = winrt::Microsoft::Windows::AI::Text::LanguageModel::GetDefault();
        
        if (languageModel)
        {
          capabilities.isSupported = true;
          capabilities.hasNPU = true; // Assume NPU if Phi Silica is available
          capabilities.hasGPU = false; // Phi Silica primarily uses NPU
          capabilities.modelName = "Phi Silica";
        }
        else
        {
          capabilities.isSupported = false;
          capabilities.hasNPU = false;
          capabilities.hasGPU = false;
          capabilities.modelName = std::nullopt;
        }
      }
      catch (...)
      {
        // If any error occurs (e.g., API not available, hardware not supported), assume not supported
        capabilities.isSupported = false;
        capabilities.hasNPU = false;
        capabilities.hasGPU = false;
        capabilities.modelName = std::nullopt;
      }
      
      return capabilities;
    }

    // Asynchronously generate text using local Phi Silica model
    REACT_METHOD(generateText)
    winrt::fire_and_forget generateText(std::string prompt, std::optional<std::string> systemInstructions, ::React::ReactPromise<std::string> result) noexcept
    {
      try 
      {
        // Get the default Phi Silica language model
        auto languageModel = winrt::Microsoft::Windows::AI::Text::LanguageModel::GetDefault();
        
        if (!languageModel)
        {
          result.Reject("Phi Silica language model is not available on this device. Compatible NPU hardware and Windows AI support required.");
          co_return;
        }

        // Prepare the full prompt with system instructions
        // Format: [System Instructions]\n\nHuman: [User Prompt]\n\nAssistant:
        std::string fullPrompt;
        if (systemInstructions.has_value() && !systemInstructions.value().empty())
        {
          fullPrompt = systemInstructions.value() + "\n\nHuman: " + prompt + "\n\nAssistant:";
        }
        else
        {
          fullPrompt = "Human: " + prompt + "\n\nAssistant:";
        }

        // Convert to winrt::hstring for Windows API
        winrt::hstring wprompt = winrt::to_hstring(fullPrompt);
        
        // Generate response using Phi Silica - this runs on the NPU
        auto response = co_await languageModel.GenerateResponseAsync(wprompt);
        
        // Convert response back to std::string
        std::string responseText = winrt::to_string(response);
        
        // Clean up the response (remove any prompt echo that might be included)
        size_t assistantPos = responseText.find("Assistant:");
        if (assistantPos != std::string::npos)
        {
          responseText = responseText.substr(assistantPos + 10); // Skip "Assistant:"
        }
        
        // Trim whitespace from both ends
        auto start = responseText.find_first_not_of(" \t\n\r");
        if (start == std::string::npos)
        {
          responseText = "";
        }
        else
        {
          auto end = responseText.find_last_not_of(" \t\n\r");
          responseText = responseText.substr(start, end - start + 1);
        }
        
        // Ensure we have a non-empty response
        if (responseText.empty())
        {
          responseText = "I apologize, but I couldn't generate a response. Please try again.";
        }
        
        result.Resolve(responseText);
      }
      catch (winrt::hresult_error const& ex)
      {
        // Handle Windows-specific errors with detailed error information
        std::wstring errorMsg = L"Error generating text with Phi Silica: ";
        errorMsg += ex.message();
        result.Reject(winrt::to_string(errorMsg));
      }  
      catch (...)
      {
        // Handle any other unexpected errors
        result.Reject("Unexpected error occurred while generating text with local AI model");
      }
    }

  private:
    // No persistent state needed - Phi Silica model is managed by the Windows AI system
  };
}