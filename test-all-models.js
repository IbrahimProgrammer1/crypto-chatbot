// Test all possible model configurations
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testAllModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("🔑 Testing API Key:", apiKey.substring(0, 15) + "...\n");

  const genAI = new GoogleGenerativeAI(apiKey);

  // Try different model configurations
  const modelsToTry = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "models/gemini-1.5-flash",
    "models/gemini-1.5-pro",
    "models/gemini-pro"
  ];

  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      const response = await result.response;
      const text = response.text();

      console.log(`✅ SUCCESS with: ${modelName}`);
      console.log(`Response: ${text}\n`);
      console.log(`🎉 USE THIS MODEL: "${modelName}"\n`);
      return modelName;
    } catch (error) {
      console.log(`❌ Failed: ${error.message.substring(0, 100)}...\n`);
    }
  }

  console.log("❌ None of the models worked. Your API key might not have Gemini access.");
}

testAllModels();
