const { CohereClient } = require("cohere-ai");
const axios = require("axios");
require('dotenv').config({ path: '.env.local' });

async function testAllAPIs() {
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  🔍 COMPLETE API VERIFICATION - ALL SERVICES");
  console.log("═══════════════════════════════════════════════════════════════\n");

  const results = {
    cohere: false,
    coingecko: false,
    etherscan: false,
    cryptopanic: false,
  };

  // Test 1: Cohere AI (REQUIRED)
  console.log("1️⃣  Testing Cohere AI (REQUIRED)...");
  console.log("─────────────────────────────────────────────────────────────\n");

  const cohereKey = process.env.COHERE_API_KEY;
  if (!cohereKey || cohereKey === "your_cohere_api_key_here") {
    console.log("❌ FAILED: No Cohere API key configured\n");
  } else {
    try {
      const cohere = new CohereClient({ token: cohereKey });
      await cohere.chat({
        model: "command-r7b-12-2024",
        message: "Test",
        temperature: 0.7,
      });
      console.log("✅ SUCCESS: Cohere AI is working!");
      console.log("   Your chatbot can respond to messages\n");
      results.cohere = true;
    } catch (error) {
      console.log("❌ FAILED:", error.message, "\n");
    }
  }

  // Test 2: CoinGecko (OPTIONAL but recommended)
  console.log("2️⃣  Testing CoinGecko API (OPTIONAL)...");
  console.log("─────────────────────────────────────────────────────────────\n");

  const coingeckoKey = process.env.COINGECKO_API_KEY;
  try {
    const url = coingeckoKey
      ? `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&x_cg_demo_api_key=${coingeckoKey}`
      : `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`;

    const response = await axios.get(url, { timeout: 5000 });

    if (response.data.bitcoin) {
      console.log("✅ SUCCESS: CoinGecko API is working!");
      console.log(`   Bitcoin price: $${response.data.bitcoin.usd.toLocaleString()}`);
      console.log(coingeckoKey ? "   Using API key (higher rate limits)" : "   Using free tier (lower rate limits)");
      console.log("");
      results.coingecko = true;
    }
  } catch (error) {
    console.log("❌ FAILED:", error.message);
    console.log("   Market data features may be limited\n");
  }

  // Test 3: Etherscan (OPTIONAL)
  console.log("3️⃣  Testing Etherscan API (OPTIONAL)...");
  console.log("─────────────────────────────────────────────────────────────\n");

  const etherscanKey = process.env.ETHERSCAN_API_KEY;
  if (!etherscanKey) {
    console.log("⚠️  SKIPPED: No Etherscan API key configured");
    console.log("   Blockchain features will be disabled\n");
  } else {
    try {
      const response = await axios.get(
        `https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle&apikey=${etherscanKey}`,
        { timeout: 5000 }
      );

      if (response.data.status === "1") {
        console.log("✅ SUCCESS: Etherscan API is working!");
        console.log(`   Current gas price: ${response.data.result.ProposeGasPrice} Gwei\n`);
        results.etherscan = true;
      } else {
        console.log("❌ FAILED: Invalid API key or rate limit exceeded\n");
      }
    } catch (error) {
      console.log("❌ FAILED:", error.message, "\n");
    }
  }

  // Test 4: CryptoPanic (OPTIONAL)
  console.log("4️⃣  Testing CryptoPanic API (OPTIONAL)...");
  console.log("─────────────────────────────────────────────────────────────\n");

  const cryptopanicKey = process.env.CRYPTOPANIC_API_KEY;
  if (!cryptopanicKey) {
    console.log("⚠️  SKIPPED: No CryptoPanic API key configured");
    console.log("   Will use mock news data instead\n");
  } else {
    try {
      const response = await axios.get(
        `https://cryptopanic.com/api/v1/posts/`,
        {
          params: { auth_token: cryptopanicKey, filter: "hot" },
          timeout: 5000,
        }
      );

      if (response.data && response.data.results) {
        console.log("✅ SUCCESS: CryptoPanic API is working!");
        console.log(`   Fetched ${response.data.results.length} news articles\n`);
        results.cryptopanic = true;
      }
    } catch (error) {
      console.log("⚠️  FAILED: API not working (will use mock data)");
      console.log("   This is OK - your chatbot still works fine\n");
    }
  }

  // Summary
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  📊 SUMMARY");
  console.log("══════════════════════════════════════════════════════════════\n");

  console.log("Required Services:");
  console.log(`  ${results.cohere ? "✅" : "❌"} Cohere AI (Chatbot) - ${results.cohere ? "WORKING" : "NOT WORKING"}`);

  console.log("\nOptional Services:");
  console.log(`  ${results.coingecko ? "✅" : "⚠️ "} CoinGecko (Market Data) - ${results.coingecko ? "WORKING" : "LIMITED"}`);
  console.log(`  ${results.etherscan ? "✅" : "⚠️ "} Etherscan (Blockchain) - ${results.etherscan ? "WORKING" : "DISABLED"}`);
  console.log(`  ${results.cryptopanic ? "✅" : "⚠️ "} CryptoPanic (News) - ${results.cryptopanic ? "WORKING" : "USING MOCK DATA"}`);

  console.log("\n═══════════════════════════════════════════════════════════════");

  if (results.cohere) {
    console.log("  🎉 YOUR CHATBOT IS READY TO USE!");
    console.log("═══════════════════════════════════════════════════════════════\n");
    console.log("✅ Core functionality is working");
    console.log("✅ You can start using your chatbot now");

    if (!results.etherscan || !results.cryptopanic) {
      console.log("\n💡 Optional: To enable all features, add the missing API keys");
    }

    console.log("\nRun: npm run dev");
    console.log("Then open: http://localhost:3000\n");
  } else {
    console.log("  ❌ SETUP INCOMPLETE");
    console.log("═══════════════════════════════════════════════════════════════\n");
    console.log("⚠️  Cohere API is required for the chatbot to work");
    console.log("Please add your Cohere API key to .env.local\n");
  }
}

testAllAPIs();
