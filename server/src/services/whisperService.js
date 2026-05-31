import { config } from '../config/index.js';
import fs from 'fs';
import path from 'path';

export const transcribeAudio = async (filePath) => {
  try {
    const audioBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).slice(1) || 'webm';
    
    // Map extension to MIME type
    const mimeTypes = {
      webm: 'audio/webm',
      m4a: 'audio/mp4',
      mp4: 'audio/mp4',
      wav: 'audio/wav',
      mp3: 'audio/mpeg',
      ogg: 'audio/ogg',
      flac: 'audio/flac',
    };
    const mimeType = mimeTypes[ext] || 'audio/webm';

    console.log(`Transcribing audio: ${filePath} (${audioBuffer.length} bytes, ${mimeType})`);

    // Use raw fetch to HF Inference API — most reliable approach in Node.js
    const response = await fetch(
      'https://api-inference.huggingface.co/models/openai/whisper-small',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.huggingface.token}`,
          'Content-Type': mimeType,
        },
        body: audioBuffer,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HF API error (${response.status}):`, errorText);
      throw new Error(`HF API returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    if (!result || !result.text) {
      console.error('Unexpected HF response:', JSON.stringify(result));
      throw new Error('Empty transcription result from Hugging Face');
    }

    console.log(`Transcribed: "${result.text.substring(0, 100)}..." (${result.text.length} chars)`);
    return result.text;
  } catch (error) {
    console.error('HF Whisper STT Error:', error.message);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
};
