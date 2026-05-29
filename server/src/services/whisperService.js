import OpenAI from 'openai';
import { config } from '../config/index.js';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export const transcribeAudio = async (filePath) => {
  if (!config.openai.apiKey) {
    throw new Error('OpenAI API key is missing');
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      response_format: 'text',
      language: 'en' // Can be made dynamic later
    });

    return transcription; // Returns raw text
  } catch (error) {
    console.error('Whisper STT Error:', error);
    throw new Error('Failed to transcribe audio');
  }
};
