import OpenAI from 'openai';
import { config } from '../config/index.js';
import { entityExtractionPrompt, emotionAnalysisPrompt, responseGenerationPrompt } from '../prompts/index.js';

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export const llmOrchestrator = {
  
  async extractEntities(transcript) {
    const prompt = entityExtractionPrompt.replace('{{transcript}}', transcript);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content);
  },

  async analyzeEmotion(transcript) {
    const prompt = emotionAnalysisPrompt.replace('{{transcript}}', transcript);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content);
  },

  async generateResponse(transcript, emotionData, taskData) {
    let prompt = responseGenerationPrompt
      .replace('{{transcript}}', transcript)
      .replace('{{moodScore}}', emotionData.score)
      .replace('{{emotions}}', emotionData.emotions.join(', '))
      .replace('{{tasks}}', JSON.stringify(taskData.tasks, null, 2));
      
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }]
    });

    return response.choices[0].message.content;
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
