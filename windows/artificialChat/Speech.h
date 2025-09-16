// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#pragma once

#include "pch.h"

#include "NativeModules.h"
#include "../../codegen/NativeSpeechSpec.g.h"

#include <winrt/Windows.Media.SpeechSynthesis.h>
#include <winrt/Windows.Media.Playback.h>
#include <winrt/Windows.Media.Core.h>
#include <winrt/Windows.Foundation.h>
#include <winrt/Windows.Foundation.Collections.h>
#include <winrt/Windows.Storage.Streams.h>

namespace ArtificialChatModules
{
  REACT_MODULE(Speech);
  struct Speech
  {
    using ModuleSpec = SpeechSpec;

    Speech() 
    {
      m_synthesizer = winrt::Windows::Media::SpeechSynthesis::SpeechSynthesizer();
    }

    REACT_METHOD(speak)
    winrt::fire_and_forget speak(std::string text, ::React::ReactPromise<void> result) noexcept
    {
      try 
      {
        if (!m_synthesizer)
        {
          result.Reject("Error creating SpeechSynthesizer");
          co_return;
        }

        // Convert std::string to winrt::hstring
        winrt::hstring wtext = winrt::to_hstring(text);
        
        // Synthesize text to stream
        auto stream = co_await m_synthesizer.SynthesizeTextToStreamAsync(wtext);
        
        // Create media player and play
        auto player = winrt::Windows::Media::Playback::MediaPlayer();
        winrt::hstring contentType = L"audio/wav"; // Default content type for speech synthesis
        
        auto mediaSource = winrt::Windows::Media::Core::MediaSource::CreateFromStream(stream, contentType);
        player.Source(mediaSource);
        player.Play();
        
        result.Resolve();
      }
      catch (...)
      {
        result.Reject("Error during speech synthesis");
      }
    }

    REACT_SYNC_METHOD(getVoices)
    std::vector<SpeechSpec_VoiceInfo> getVoices() noexcept
    {
      std::vector<SpeechSpec_VoiceInfo> result;
      
      try 
      {
        if (!m_synthesizer)
        {
          return result;
        }

        // Get all installed voices
        auto voices = winrt::Windows::Media::SpeechSynthesis::SpeechSynthesizer::AllVoices();
        
        // Get current voice
        auto currentVoice = m_synthesizer.Voice();
        
        for (auto const& voice : voices)
        {
          SpeechSpec_VoiceInfo voiceInfo;
          voiceInfo.displayName = winrt::to_string(voice.DisplayName());
          voiceInfo.language = winrt::to_string(voice.Language());
          voiceInfo.id = winrt::to_string(voice.Id());
          voiceInfo.isCurrent = (voice.Id() == currentVoice.Id());
          
          result.push_back(voiceInfo);
        }
      }
      catch (...)
      {
        // Return empty vector on error
      }
      
      return result;
    }

    REACT_METHOD(setVoice)
    void setVoice(std::string voiceId) noexcept
    {
      try 
      {
        if (!m_synthesizer)
        {
          return;
        }

        auto voices = winrt::Windows::Media::SpeechSynthesis::SpeechSynthesizer::AllVoices();
        
        if (!voiceId.empty())
        {
          winrt::hstring targetId = winrt::to_hstring(voiceId);
          
          // Find the voice with matching ID
          for (auto const& voice : voices)
          {
            if (voice.Id() == targetId)
            {
              m_synthesizer.Voice(voice);
              return;
            }
          }
        }
        
        // If no voice found or voiceId is empty, use default voice
        m_synthesizer.Voice(winrt::Windows::Media::SpeechSynthesis::SpeechSynthesizer::DefaultVoice());
      }
      catch (...)
      {
        // Silently handle errors
      }
    }

  private:
    winrt::Windows::Media::SpeechSynthesis::SpeechSynthesizer m_synthesizer{ nullptr };
  };
}