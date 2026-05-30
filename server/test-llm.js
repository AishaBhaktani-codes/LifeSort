import { llmOrchestrator } from './src/services/llmOrchestrator.js';

async function test() {
  console.log('Testing llmOrchestrator with a highly unusual transcript...');
  const transcript = "I am so incredibly stressed because I have to juggle three chainsaws while riding a unicycle tomorrow at the circus, and my pet iguana is giving me the silent treatment because I forgot his birthday. I just don't know how I'm going to prepare for the stunt show feeling this guilty!";
  
  try {
    const result = await llmOrchestrator.processConversation(transcript);
    console.log('\n--- Result ---');
    console.log(JSON.stringify(result, null, 2));
    console.log('--------------\n');
    console.log('Test completed successfully.');
  } catch (err) {
    console.error('Test failed with error:', err);
  }
}

test();
