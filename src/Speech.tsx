import 'react-native-winrt'

let synth = new Windows.Media.SpeechSynthesis.SpeechSynthesizer();

async function Speak(text: string) {
  if (!synth) {
    console.log("error creating SpeechSynthesizer");
    return;
  }
  
  try {
    let stream = await synth.synthesizeTextToStreamAsync(text);

    let player = new Windows.Media.Playback.MediaPlayer();
    let contentType = stream.contentType ?? 'audio/wav'; // Workaround for lack of contentType on stream type
    player.source = Windows.Media.Core.MediaSource.createFromStream(stream, contentType);
    player.play();
  } catch (e) {
    console.log(e);
  }

  // player.Dispose();
}

function GetVoices() {
  if (!synth) {
    console.log("error creating SpeechSynthesizer");
    return;
  }

  // Get all of the installed voices.
  let voices = Windows.Media.SpeechSynthesis.SpeechSynthesizer.allVoices;

  // Get the currently selected voice.
  let currentVoice = synth.voice;

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
  if (!synth) {
    console.log("error creating SpeechSynthesizer");
    return;
  }

  let voices = Windows.Media.SpeechSynthesis.SpeechSynthesizer.allVoices;
  let voice = voices.find((voice) => voice.id === voiceId);
  if (voice) {
    synth.voice = voice;
  } else {
    synth.voice = Windows.Media.SpeechSynthesis.SpeechSynthesizer.defaultVoice;
  }
}

export { Speak, GetVoices, SetVoice };