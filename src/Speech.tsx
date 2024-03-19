import 'react-native-winrt'

export default async function Speak(text: string) {
  let synth = new Windows.Media.SpeechSynthesis.SpeechSynthesizer();
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