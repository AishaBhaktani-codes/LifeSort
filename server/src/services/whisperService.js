import { HfInference } from '@huggingface/inference';
import { config } from '../config/index.js';
import fs from 'fs';

const client = new HfInference(config.huggingface.token);

export const transcribeAudio = async (filePath) => {
  try {
    // Read the audio file as a buffer
    const audioBuffer = fs.readFileSync(filePath);
    const audioBlob = new Blob([audioBuffer]);

    // Use HF Inference API for speech-to-text (runs on HF servers, not locally)
    const result = await client.automaticSpeechRecognition({
      model: 'openai/whisper-large-v3-turbo',
      data: audioBlob,
    });

    if (!result || !result.text) {
      throw new Error('Empty transcription result from Hugging Face');
    }

    console.log(`Transcribed ${result.text.length} characters from audio`);
    return result.text;
  } catch (error) {
    console.error('HF Whisper STT Error:', error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
};
