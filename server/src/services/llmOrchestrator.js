import { HfInference } from '@huggingface/inference';
import { config } from '../config/index.js';
import { entityExtractionPrompt, emotionAnalysisPrompt, responseGenerationPrompt } from '../prompts/index.js';

const client = new HfInference(config.huggingface.token);
const MODEL = "meta-llama/Meta-Llama-3-8B-Instruct"; // Free and fast model on HF

export const llmOrchestrator = {
  
  async extractEntities(transcript) {
    const prompt = entityExtractionPrompt.replace('{{transcript}}', transcript);
    
    const response = await client.chatCompletion({
      model: MODEL,
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 500,
      temperature: 0.1
    });

    // Extract JSON from response in case of markdown formatting
    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : content);
  },

  async analyzeEmotion(transcript) {
    const prompt = emotionAnalysisPrompt.replace('{{transcript}}', transcript);
    
    const response = await client.chatCompletion({
      model: MODEL,
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 200,
      temperature: 0.1
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : content);
  },

  async generateResponse(transcript, emotionData, taskData) {
    let prompt = responseGenerationPrompt
      .replace('{{transcript}}', transcript)
      .replace('{{moodScore}}', emotionData.score)
      .replace('{{emotions}}', emotionData.emotions.join(', '))
      .replace('{{tasks}}', JSON.stringify(taskData.tasks, null, 2));
      
    const response = await client.chatCompletion({
      model: MODEL,
      messages: [{ role: 'system', content: prompt }],
      max_tokens: 300,
      temperature: 0.7
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
