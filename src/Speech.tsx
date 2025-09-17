import NativeSpeech from './NativeSpeech';

async function Speak(text: string) {
  try {
    await NativeSpeech.speak(text);
  } catch (e) {
    console.log(e);
  }
}

function GetVoices() {
  try {
    return NativeSpeech.getVoices();
  } catch (e) {
    console.log(e);
    return [];
  }
}

function SetVoice(voiceId: string | undefined) {
  try {
    NativeSpeech.setVoice(voiceId);
  } catch (e) {
    console.log(e);
  }
}

export { Speak, GetVoices, SetVoice };