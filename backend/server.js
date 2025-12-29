import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/tts", async (req, res) => {
  try {
    const { text } = req.body;
    const output = await client.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: text
    });
    const buffer = Buffer.from(await output.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("TTS Error");
  }
});

app.listen(3000, () => console.log("TTS API running on http://localhost:3000"));
