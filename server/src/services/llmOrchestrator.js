import ollama from 'ollama';
import { config } from '../config/index.js';
import { entityExtractionPrompt, emotionAnalysisPrompt, responseGenerationPrompt } from '../prompts/index.js';

export const llmOrchestrator = {
  
  async extractEntities(transcript) {
    const prompt = entityExtractionPrompt.replace('{{transcript}}', transcript);
    
    const response = await ollama.chat({
      model: 'openbmb/minicpm-o4.5',
      messages: [{ role: 'system', content: prompt }],
      format: 'json',
      options: { num_gpu: 0 } // Force CPU to avoid CUDA OOM
    });

    return JSON.parse(response.message.content);
  },

  async analyzeEmotion(transcript) {
    const prompt = emotionAnalysisPrompt.replace('{{transcript}}', transcript);
    
    const response = await ollama.chat({
      model: 'openbmb/minicpm-o4.5',
      messages: [{ role: 'system', content: prompt }],
      format: 'json',
      options: { num_gpu: 0 } // Force CPU to avoid CUDA OOM
    });

    return JSON.parse(response.message.content);
  },

  async generateResponse(transcript, emotionData, taskData) {
    let prompt = responseGenerationPrompt
      .replace('{{transcript}}', transcript)
      .replace('{{moodScore}}', emotionData.score)
      .replace('{{emotions}}', emotionData.emotions.join(', '))
      .replace('{{tasks}}', JSON.stringify(taskData.tasks, null, 2));
      
    const response = await ollama.chat({
      model: 'openbmb/minicpm-o4.5',
      messages: [{ role: 'system', content: prompt }],
      options: { num_gpu: 0 } // Force CPU to avoid CUDA OOM
    });

    return response.message.content;
  },

  async processConversation(transcript) {
    // Run entity extraction and emotion analysis in parallel
    const [entities, emotions] = await Promise.all([
      this.extractEntities(transcript),
      this.analyzeEmotion(transcript)
    ]);

    // Generate the empathetic response
    const assistantResponse = await this.generateResponse(transcript, emotions, entities);

    return {
      entities,
      emotions,
      assistantResponse
    };
  }
};
