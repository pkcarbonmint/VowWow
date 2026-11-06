const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function listModels() {
  console.log('Fetching available models from Groq...\n');
  try {
    const models = await groq.models.list();
    console.log('Available models:');
    console.log('═'.repeat(60));
    models.data.forEach(model => {
      console.log(`\n📦 ${model.id}`);
      if (model.context_window) console.log(`   Context: ${model.context_window} tokens`);
      if (model.owned_by) console.log(`   Owner: ${model.owned_by}`);
    });
    console.log('\n' + '═'.repeat(60));
  } catch (error) {
    console.error('Error fetching models:', error.message);
  }
}

listModels();
