import { config } from '../config/index.js';
import fs from 'fs';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: config.groq.apiKey
});

export const transcribeAudio = async (filePath) => {
  try {
    console.log(`Transcribing audio with Groq: ${filePath}`);

    const transcription = await groq.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-large-v3",
        response_format: "json",
        language: "en",
        temperature: 0.0
    });

    if (!transcription || !transcription.text) {
      throw new Error('Empty transcription result from Groq');
    }

    console.log(`Transcribed: "${transcription.text.substring(0, 100)}..." (${transcription.text.length} chars)`);
    return transcription.text;
  } catch (error) {
    console.error('Groq Whisper STT Error:', error.message);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
};
