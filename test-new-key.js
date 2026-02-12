// Quick test after getting new API key
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function quickTest() {
  const apiKey = process.env.GEMINI_API_KEY;

  console.log("🔑 API Key:", apiKey ? apiKey.substring(0, 15) + "..." : "NOT FOUND");

  if (!apiKey) {
    console.error("\n❌ No API key found in .env.local\n");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    console.log("\n🧪 Testing API key with a simple request...\n");
    const result = await model.generateContent("Say 'Hello! I am working!' in one sentence.");
    const response = await result.response;
    const text = response.text();

    console.log("✅ SUCCESS! Your API key works!\n");
    console.log("📝 Response:", text);
    console.log("\n🎉 Your chatbot should now work! Restart your dev server.\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.log("\n⚠️  The API key still doesn't work. Please:");
    console.log("   1. Make sure you copied the ENTIRE key");
    console.log("   2. Check for extra spaces in .env.local");
    console.log("   3. Try generating a completely new key\n");
  }
}

quickTest();
