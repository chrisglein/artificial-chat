// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#pragma once

#include "pch.h"

#include "NativeModules.h"
#include "../../codegen/NativeLocalAISpec.g.h"

// Windows AI Foundry includes for Phi Silica
#include <winrt/Microsoft.Windows.AI.Text.h>
#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Foundation.Collections.h>

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

    REACT_SYNC_METHOD(checkCapabilities)
    LocalAISpec_LocalAICapabilities checkCapabilities() noexcept
    {
      LocalAISpec_LocalAICapabilities capabilities;
      
      try 
      {
        // Check if Phi Silica language model is available
        auto languageModel = winrt::Microsoft::Windows::AI::Text::LanguageModel::GetDefault();
        
        if (languageModel)
        {
          capabilities.isSupported = true;
          capabilities.hasNPU = true; // Assume NPU if Phi Silica is available
          capabilities.hasGPU = false; // For now, focus on NPU
          capabilities.modelName = "Phi Silica";
        }
        else
        {
          capabilities.isSupported = false;
          capabilities.hasNPU = false;
          capabilities.hasGPU = false;
        }
      }
      catch (...)
      {
        // If any error occurs, assume not supported
        capabilities.isSupported = false;
        capabilities.hasNPU = false;
        capabilities.hasGPU = false;
      }
      
      return capabilities;
    }

    REACT_METHOD(generateText)
    winrt::fire_and_forget generateText(std::string prompt, std::optional<std::string> systemInstructions, ::React::ReactPromise<std::string> result) noexcept
    {
      try 
      {
        // Get the default language model
        auto languageModel = winrt::Microsoft::Windows::AI::Text::LanguageModel::GetDefault();
        
        if (!languageModel)
        {
          result.Reject("Phi Silica language model is not available on this device");
          co_return;
        }

        // Prepare the full prompt with system instructions
        std::string fullPrompt;
        if (systemInstructions.has_value() && !systemInstructions.value().empty())
        {
          fullPrompt = systemInstructions.value() + "\n\nHuman: " + prompt + "\n\nAssistant:";
        }
        else
        {
          fullPrompt = "Human: " + prompt + "\n\nAssistant:";
        }

        // Convert to winrt::hstring
        winrt::hstring wprompt = winrt::to_hstring(fullPrompt);
        
        // Generate response using Phi Silica
        auto response = co_await languageModel.GenerateResponseAsync(wprompt);
        
        // Convert response back to std::string
        std::string responseText = winrt::to_string(response);
        
        // Clean up the response if needed (remove any prompt echo)
        // This is a simple cleanup - in practice you might want more sophisticated parsing
        size_t assistantPos = responseText.find("Assistant:");
        if (assistantPos != std::string::npos)
        {
          responseText = responseText.substr(assistantPos + 10); // Skip "Assistant:"
        }
        
        // Trim whitespace
        responseText.erase(0, responseText.find_first_not_of(" \t\n\r"));
        responseText.erase(responseText.find_last_not_of(" \t\n\r") + 1);
        
        result.Resolve(responseText);
      }
      catch (...)
      {
        result.Reject("Error generating text with local AI model");
      }
    }

  private:
    // No persistent state needed for now
  };
}