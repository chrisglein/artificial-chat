//import 'react-native-winrt'

async function Speak(text: string) {
}

function GetVoices() {
  // Get all of the installed voices.
  let voices = [{displayName: "Test Voice", language: "en-US", id: "test-voice"}];

  // Get the currently selected voice.
  let currentVoice = {id: "test-voice"};

  let result = voices.map((voice) => {
    return {
      displayName: voice.displayName,
      language: voice.language,
      id: voice.id,
      isCurrent: voice.id === currentVoice.id,
    };
  });

  return result;
}

function SetVoice(voiceId: string | undefined) {
}

export { Speak, GetVoices, SetVoice };