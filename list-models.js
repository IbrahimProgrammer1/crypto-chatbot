// List available models for your API key
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found");
    return;
  }

  console.log("🔑 Testing API Key:", apiKey.substring(0, 15) + "...\n");

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    console.log("📋 Attempting to list available models...\n");

    // Try to list models
    const models = await genAI.listModels();

    console.log("✅ Available models for your API key:\n");
    for await (const model of models) {
      console.log(`  - ${model.name}`);
      console.log(`    Supported methods: ${model.supportedGenerationMethods?.join(", ")}`);
      console.log("");
    }
  } catch (error) {
    console.error("❌ Error listing models:", error.message);
    console.log("\n⚠️  Your API key appears to be invalid or expired.");
    console.log("\n📝 Please generate a NEW API key:");
    console.log("   1. Go to: https://aistudio.google.com/app/apikey");
    console.log("   2. Click 'Create API Key'");
    console.log("   3. Copy the new key");
    console.log("   4. Replace GEMINI_API_KEY in .env.local");
    console.log("   5. Restart your dev server\n");
  }
}

listModels();
