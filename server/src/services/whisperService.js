import { pipeline, env } from '@xenova/transformers';
import wavefile from 'wavefile';
const { WaveFile } = wavefile;
import fs from 'fs';

// Disable local models if you want to always pull from HF, or just leave default caching.
env.allowLocalModels = false;

let transcriber = null;

export const transcribeAudio = async (filePath) => {
  try {
    // Lazy load the transcriber pipeline (downloads model on first run)
    if (!transcriber) {
      transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
    }

    // Read audio file
    const buffer = fs.readFileSync(filePath);
    const wav = new WaveFile(buffer);
    
    // Whisper expects 16kHz audio
    wav.toBitDepth('32f');
    wav.toSampleRate(16000);

    let audioData = wav.getSamples();
    if (Array.isArray(audioData)) {
      if (audioData.length > 1) {
        // Merge channels if stereo
        const SCALING_FACTOR = Math.sqrt(2);
        for (let i = 0; i < audioData[0].length; ++i) {
          audioData[0][i] = (SCALING_FACTOR * (audioData[0][i] + audioData[1][i])) / 2;
        }
      }
      audioData = audioData[0]; // Use first channel
    }

    // Transcribe
    const output = await transcriber(audioData);
    return output.text;
  } catch (error) {
    console.error('Local Whisper STT Error:', error);
    throw new Error('Failed to transcribe audio locally');
  }
};
