const { CohereClient } = require("cohere-ai");
require('dotenv').config({ path: '.env.local' });

async function testCohere() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  🧪 TESTING COHERE API");
  console.log("═══════════════════════════════════════════════════════\n");

  const apiKey = process.env.COHERE_API_KEY;

  if (!apiKey) {
    console.log("❌ ERROR: No COHERE_API_KEY found in .env.local\n");
    console.log("Please add your Cohere API key to .env.local:\n");
    console.log("   COHERE_API_KEY=your_key_here\n");
    console.log("Get a free key at: https://dashboard.cohere.com/api-keys\n");
    process.exit(1);
  }

  if (apiKey === "your_cohere_api_key_here") {
    console.log("❌ ERROR: Please replace the placeholder with your actual Cohere API key\n");
    console.log("1. Go to: https://dashboard.cohere.com/api-keys");
    console.log("2. Sign up or log in");
    console.log("3. Copy your API key");
    console.log("4. Update .env.local with your key\n");
    process.exit(1);
  }

  console.log("✅ API Key found:", apiKey.substring(0, 10) + "...\n");

  try {
    console.log("🔄 Testing API connection...\n");

    const cohere = new CohereClient({
      token: apiKey,
    });

    const response = await cohere.chat({
      model: "command-r7b-12-2024",
      message: "Say 'Hello! I am working perfectly!' in one short sentence.",
      temperature: 0.7,
    });

    console.log("═══════════════════════════════════════════════════════");
    console.log("  🎉 SUCCESS! COHERE API IS WORKING!");
    console.log("═══════════════════════════════════════════════════════\n");
    console.log("📝 Test Response:", response.text);
    console.log("\n✅ Your chatbot is ready to use!\n");
    console.log("Next steps:");
    console.log("1. Run: npm run dev");
    console.log("2. Open: http://localhost:3000");
    console.log("3. Test your chatbot!\n");
    console.log("═══════════════════════════════════════════════════════\n");

  } catch (error) {
    console.log("═══════════════════════════════════════════════════════");
    console.log("  ❌ ERROR: API TEST FAILED");
    console.log("═══════════════════════════════════════════════════════\n");

    if (error.message.includes("401") || error.message.includes("unauthorized")) {
      console.log("❌ Your API key is invalid or unauthorized\n");
      console.log("Please:");
      console.log("1. Go to: https://dashboard.cohere.com/api-keys");
      console.log("2. Create a NEW API key");
      console.log("3. Copy the ENTIRE key");
      console.log("4. Update .env.local with the new key");
      console.log("5. Run this test again\n");
    } else if (error.message.includes("429") || error.message.includes("rate limit")) {
      console.log("❌ Rate limit exceeded\n");
      console.log("Please wait a few minutes and try again.\n");
    } else {
      console.log("❌ Error:", error.message, "\n");
      console.log("Full error:", error, "\n");
    }

    process.exit(1);
  }
}

testCohere();
