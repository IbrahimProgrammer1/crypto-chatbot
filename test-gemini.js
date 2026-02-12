// Quick test script to verify Gemini API key
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found in .env.local");
    return;
  }

  console.log("✓ API Key found:", apiKey.substring(0, 10) + "...");

  const genAI = new GoogleGenerativeAI(apiKey);

  // Try different model names
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-1.0-pro"
  ];

  for (const modelName of modelsToTry) {
    try {
      console.log(`\nTrying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      const response = await result.response;
      const text = response.text();

      console.log(`✅ SUCCESS with ${modelName}`);
      console.log(`Response: ${text.substring(0, 50)}...`);
      console.log(`\n🎉 Use this model in your app: "${modelName}"`);
      break;
    } catch (error) {
      console.log(`❌ Failed with ${modelName}: ${error.message}`);
    }
  }
}

testGemini();
