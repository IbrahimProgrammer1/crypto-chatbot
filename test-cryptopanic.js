const axios = require("axios");
require('dotenv').config({ path: '.env.local' });

async function testCryptoPanic() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  🧪 TESTING CRYPTOPANIC API");
  console.log("═══════════════════════════════════════════════════════\n");

  const apiKey = process.env.CRYPTOPANIC_API_KEY;

  if (!apiKey) {
    console.log("❌ No CRYPTOPANIC_API_KEY found in .env.local\n");
    console.log("This API is OPTIONAL. Your chatbot works without it.\n");
    console.log("To enable news features:");
    console.log("1. Go to: https://cryptopanic.com/developers/api/");
    console.log("2. Sign up for a free account");
    console.log("3. Request an API key");
    console.log("4. Add it to .env.local\n");
    console.log("💡 Note: Without this key, the app uses mock news data.\n");
    return;
  }

  console.log("✅ API Key found:", apiKey.substring(0, 10) + "...\n");

  try {
    console.log("🔄 Testing CryptoPanic API...\n");

    // Test: Fetch latest crypto news
    console.log("Test: Fetching latest crypto news...");
    const response = await axios.get(
      `https://cryptopanic.com/api/v1/posts/`,
      {
        params: {
          auth_token: apiKey,
          filter: "hot",
        },
        timeout: 10000,
      }
    );

    if (response.data && response.data.results) {
      console.log("✅ News fetched successfully!\n");
      console.log("📰 Latest Headlines:\n");

      response.data.results.slice(0, 5).forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`   Source: ${item.source.title}`);
        console.log(`   Published: ${new Date(item.published_at).toLocaleString()}\n`);
      });

      console.log("═══════════════════════════════════════════════════════");
      console.log("  🎉 SUCCESS! CRYPTOPANIC API IS WORKING!");
      console.log("═══════════════════════════════════════════════════════\n");
      console.log("✅ Your chatbot can now:");
      console.log("   - Show latest crypto news");
      console.log("   - Filter news by sentiment (bullish/bearish)");
      console.log("   - Get news for specific cryptocurrencies");
      console.log("   - Provide real-time market updates\n");

    } else {
      throw new Error("Unexpected response format");
    }

  } catch (error) {
    console.log("═══════════════════════════════════════════════════════");
    console.log("  ⚠️  CRYPTOPANIC API NOT WORKING");
    console.log("═══════════════════════════════════════════════════════\n");

    if (error.response) {
      console.log("❌ Error:", error.response.status, error.response.statusText);

      if (error.response.status === 404) {
        console.log("\n⚠️  The API endpoint returned 404.");
        console.log("This might mean:");
        console.log("- Your API key is invalid");
        console.log("- The API key needs to be approved");
        console.log("- CryptoPanic changed their API\n");
      } else if (error.response.status === 401) {
        console.log("\n⚠️  Your API key is unauthorized.\n");
        console.log("Please:");
        console.log("1. Check if your key is correct");
        console.log("2. Make sure the key is approved");
        console.log("3. Try generating a new key\n");
      }
    } else {
      console.log("❌ Error:", error.message);
    }

    console.log("💡 GOOD NEWS: Your chatbot still works!");
    console.log("   It will use mock news data instead of live news.");
    console.log("   This is perfectly fine for development and testing.\n");
  }
}

testCryptoPanic();
