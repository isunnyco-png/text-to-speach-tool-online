// /api/tts.js  (for Vercel backend)
export default async function handler(req, res) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY; // From Vercel Environment Variables

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${AIzaSyAB51GCNGWDNGmliFRBIiHayrdfYKmnffA}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    if (!data.audioContent) {
      return res.status(500).json({ error: "API failed", details: data });
    }

    res.status(200).json({ audioContent: data.audioContent });
  } catch (error) {
    console.error("TTS API Error:", error);
    res.status(500).json({ error: "Server error generating MP3" });
  }
}
