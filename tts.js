import textToSpeech from "@google-cloud/text-to-speech";

const client = new textToSpeech.TextToSpeechClient({
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_KEY)
});

export default async function handler(req, res) {
  try {
    const { text, lang, voice, rate, pitch } = req.query;

    if (!text) return res.status(400).send("Please enter text.");

    const request = {
      input: { text },
      voice: { languageCode: lang, name: voice },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: Number(rate) || 1.0,
        pitch: Number(pitch) || 0
      }
    };

    const [response] = await client.synthesizeSpeech(request);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "attachment; filename=tts.mp3");
    return res.send(Buffer.from(response.audioContent, "base64"));

  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error: Unable to generate audio.");
  }
}
